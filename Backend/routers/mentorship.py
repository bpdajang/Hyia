from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from models.mentorship import MentorshipStatus
from models.notification import NotificationType
from models.user import UserRole
from schemas.mentorship import SendMentorshipRequest, RespondMentorshipRequest
from services.notification_service import create_notification
from utils.auth import get_current_user, require_role

router = APIRouter(prefix="/mentorship", tags=["Mentorship"])


@router.post("/request/{alumni_id}", status_code=201)
async def send_request(
    alumni_id: str,
    body: SendMentorshipRequest,
    current_user: dict = Depends(require_role(UserRole.student)),
):
    db = get_db()

    if not ObjectId.is_valid(alumni_id):
        raise HTTPException(status_code=400, detail="Invalid alumni ID")

    alumni = await db.users.find_one({"_id": ObjectId(alumni_id), "role": "alumni"})
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")

    profile = alumni.get("profile", {})
    if profile.get("mentee_count", 0) >= profile.get("max_mentees", 3):
        raise HTTPException(
            status_code=400,
            detail=f"{alumni['name']} has reached their mentee limit ({profile.get('max_mentees', 3)})",
        )

    existing = await db.mentorship_requests.find_one({
        "student_id": current_user["id"],
        "alumni_id": alumni_id,
        "status": {"$in": [MentorshipStatus.pending.value, MentorshipStatus.accepted.value]},
    })
    if existing:
        raise HTTPException(status_code=400, detail="You already have an active request with this alumni")

    doc = {
        "student_id": current_user["id"],
        "student_name": current_user["name"],
        "alumni_id": alumni_id,
        "alumni_name": alumni["name"],
        "message": body.message,
        "status": MentorshipStatus.pending.value,
        "created_at": datetime.utcnow(),
        "updated_at": None,
    }
    result = await db.mentorship_requests.insert_one(doc)
    request_id = str(result.inserted_id)

    # Open a message thread so the student and alumni can communicate
    await db.messages.insert_one({
        "sender_id": current_user["id"],
        "receiver_id": alumni_id,
        "content": f"[Mentorship Request]\n\n{body.message}",
        "read": False,
        "created_at": datetime.utcnow(),
    })

    # Notify alumni
    await create_notification(
        user_id=alumni_id,
        type=NotificationType.mentorship_request,
        content=f"{current_user['name']} sent you a mentorship request",
        meta={"from_id": current_user["id"], "from_name": current_user["name"], "request_id": request_id},
    )

    # Confirm to student
    await create_notification(
        user_id=current_user["id"],
        type=NotificationType.mentorship_request,
        content=f"Your mentorship request to {alumni['name']} is pending review",
        meta={"to_id": alumni_id, "to_name": alumni["name"], "request_id": request_id},
    )

    return {"message": "Mentorship request sent", "request_id": request_id}


@router.patch("/{request_id}/respond")
async def respond_to_request(
    request_id: str,
    body: RespondMentorshipRequest,
    current_user: dict = Depends(require_role(UserRole.alumni)),
):
    db = get_db()

    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    req = await db.mentorship_requests.find_one({"_id": ObjectId(request_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Mentorship request not found")
    if req["alumni_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your request to respond to")
    if req["status"] != MentorshipStatus.pending.value:
        raise HTTPException(status_code=400, detail="Request already responded to")
    if body.action not in (MentorshipStatus.accepted, MentorshipStatus.rejected):
        raise HTTPException(status_code=400, detail="Action must be 'accepted' or 'rejected'")

    if body.action == MentorshipStatus.accepted:
        alumni = await db.users.find_one({"_id": ObjectId(current_user["id"])})
        profile = alumni.get("profile", {})
        if profile.get("mentee_count", 0) >= profile.get("max_mentees", 3):
            raise HTTPException(status_code=400, detail="You have reached your mentee limit")
        await db.users.update_one(
            {"_id": ObjectId(current_user["id"])},
            {"$inc": {"profile.mentee_count": 1}},
        )

    await db.mentorship_requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": body.action.value, "updated_at": datetime.utcnow()}},
    )

    # Notify student
    notif_type = (
        NotificationType.mentorship_accepted
        if body.action == MentorshipStatus.accepted
        else NotificationType.mentorship_rejected
    )
    await create_notification(
        user_id=req["student_id"],
        type=notif_type,
        content=f"{current_user['name']} {body.action.value} your mentorship request",
        meta={"from_id": current_user["id"], "from_name": current_user["name"], "request_id": request_id},
    )

    return {"message": f"Mentorship request {body.action.value}"}


@router.patch("/{request_id}/end")
async def end_mentorship(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    req = await db.mentorship_requests.find_one({"_id": ObjectId(request_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Mentorship request not found")
    if current_user["id"] not in (req["student_id"], req["alumni_id"]):
        raise HTTPException(status_code=403, detail="Not part of this mentorship")
    if req["status"] != MentorshipStatus.accepted.value:
        raise HTTPException(status_code=400, detail="Mentorship is not active")

    await db.users.update_one(
        {"_id": ObjectId(req["alumni_id"])},
        {"$inc": {"profile.mentee_count": -1}},
    )
    await db.mentorship_requests.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": MentorshipStatus.ended.value, "updated_at": datetime.utcnow()}},
    )

    # Notify the other party
    other_id = req["alumni_id"] if current_user["id"] == req["student_id"] else req["student_id"]
    await create_notification(
        user_id=other_id,
        type=NotificationType.mentorship_ended,
        content=f"{current_user['name']} ended the mentorship",
        meta={"from_id": current_user["id"], "from_name": current_user["name"], "request_id": request_id},
    )

    return {"message": "Mentorship ended"}


@router.get("/my-requests")
async def my_requests(current_user: dict = Depends(require_role(UserRole.student))):
    db = get_db()
    cursor = db.mentorship_requests.find({"student_id": current_user["id"]})
    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result


@router.get("/my-mentees")
async def my_mentees(current_user: dict = Depends(require_role(UserRole.alumni))):
    db = get_db()
    cursor = db.mentorship_requests.find({
        "alumni_id": current_user["id"],
        "status": MentorshipStatus.accepted.value,
    })
    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result


@router.get("/incoming")
async def incoming_requests(current_user: dict = Depends(require_role(UserRole.alumni))):
    db = get_db()
    cursor = db.mentorship_requests.find({
        "alumni_id": current_user["id"],
        "status": MentorshipStatus.pending.value,
    })
    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result


@router.get("/{request_id}")
async def get_request(
    request_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    req = await db.mentorship_requests.find_one({"_id": ObjectId(request_id)})
    if not req:
        raise HTTPException(status_code=404, detail="Mentorship request not found")
    if current_user["id"] not in (req["student_id"], req["alumni_id"]):
        raise HTTPException(status_code=403, detail="Not part of this mentorship")

    req["id"] = str(req.pop("_id"))
    return req
