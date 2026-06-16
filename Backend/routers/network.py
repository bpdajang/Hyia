from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from models.connection import ConnectionStatus
from models.notification import NotificationType
from schemas.network import RespondRequest
from services.notification_service import create_notification
from utils.auth import get_current_user

router = APIRouter(prefix="/network", tags=["Network"])


@router.post("/connect/{user_id}", status_code=201)
async def send_connection_request(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    sender_id = current_user["id"]

    if sender_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot connect with yourself")
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    target = await db.users.find_one({"_id": ObjectId(user_id)})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    existing = await db.connections.find_one({
        "$or": [
            {"sender_id": sender_id, "receiver_id": user_id},
            {"sender_id": user_id, "receiver_id": sender_id},
        ]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Connection request already exists")

    doc = {
        "sender_id": sender_id,
        "receiver_id": user_id,
        "status": ConnectionStatus.pending.value,
        "created_at": datetime.utcnow(),
        "updated_at": None,
    }
    result = await db.connections.insert_one(doc)

    # Notify receiver
    await create_notification(
        user_id=user_id,
        type=NotificationType.connection_request,
        content=f"{current_user['name']} sent you a connection request",
        meta={"from_id": sender_id, "from_name": current_user["name"], "request_id": str(result.inserted_id)},
    )

    return {"message": "Connection request sent", "request_id": str(result.inserted_id)}


@router.patch("/respond/{request_id}")
async def respond_to_request(
    request_id: str,
    body: RespondRequest,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    if not ObjectId.is_valid(request_id):
        raise HTTPException(status_code=400, detail="Invalid request ID")

    conn = await db.connections.find_one({"_id": ObjectId(request_id)})
    if not conn:
        raise HTTPException(status_code=404, detail="Connection request not found")
    if conn["receiver_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your connection request to respond to")
    if conn["status"] != ConnectionStatus.pending.value:
        raise HTTPException(status_code=400, detail="Request already responded to")
    if body.action not in (ConnectionStatus.accepted, ConnectionStatus.rejected):
        raise HTTPException(status_code=400, detail="Action must be 'accepted' or 'rejected'")

    await db.connections.update_one(
        {"_id": ObjectId(request_id)},
        {"$set": {"status": body.action.value, "updated_at": datetime.utcnow()}},
    )

    # Notify sender on accept
    if body.action == ConnectionStatus.accepted:
        await create_notification(
            user_id=conn["sender_id"],
            type=NotificationType.connection_accepted,
            content=f"{current_user['name']} accepted your connection request",
            meta={"from_id": current_user["id"], "from_name": current_user["name"]},
        )

    return {"message": f"Connection {body.action.value}"}


@router.get("/connections")
async def my_connections(current_user: dict = Depends(get_current_user)):
    db = get_db()
    user_id = current_user["id"]

    cursor = db.connections.find({
        "$or": [{"sender_id": user_id}, {"receiver_id": user_id}],
        "status": ConnectionStatus.accepted.value,
    })

    connected_ids = []
    async for conn in cursor:
        other = conn["receiver_id"] if conn["sender_id"] == user_id else conn["sender_id"]
        connected_ids.append(ObjectId(other))

    if not connected_ids:
        return []

    users_cursor = db.users.find(
        {"_id": {"$in": connected_ids}},
        {"hashed_password": 0, "skills_embedding": 0},
    )
    result = []
    async for u in users_cursor:
        u["id"] = str(u.pop("_id"))
        result.append(u)
    return result


@router.get("/pending")
async def pending_requests(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.connections.find({
        "receiver_id": current_user["id"],
        "status": ConnectionStatus.pending.value,
    })
    result = []
    async for conn in cursor:
        conn["id"] = str(conn.pop("_id"))
        result.append(conn)
    return result


@router.get("/peers")
async def peers(current_user: dict = Depends(get_current_user)):
    db = get_db()

    if current_user.get("role") != "student":
        raise HTTPException(status_code=403, detail="Only students can view peers")

    dept = current_user.get("profile", {}).get("department")
    if not dept:
        raise HTTPException(status_code=400, detail="Update your department first")

    cursor = db.users.find(
        {
            "role": "student",
            "profile.department": dept,
            "_id": {"$ne": ObjectId(current_user["id"])},
        },
        {"hashed_password": 0, "skills_embedding": 0},
    )
    result = []
    async for u in cursor:
        u["id"] = str(u.pop("_id"))
        result.append(u)
    return result
