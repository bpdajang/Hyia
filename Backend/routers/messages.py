from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from models.connection import ConnectionStatus
from models.notification import NotificationType
from schemas.message import SendMessageRequest
from services.notification_service import create_notification
from utils.auth import get_current_user

router = APIRouter(prefix="/messages", tags=["Messages"])


async def can_message(db, user_a: str, user_b: str) -> bool:
    conn = await db.connections.find_one({
        "$or": [
            {"sender_id": user_a, "receiver_id": user_b},
            {"sender_id": user_b, "receiver_id": user_a},
        ],
        "status": ConnectionStatus.accepted.value,
    })
    if conn:
        return True
    # Also allow messaging for active mentorship relationships
    mentorship = await db.mentorship_requests.find_one({
        "$or": [
            {"student_id": user_a, "alumni_id": user_b},
            {"student_id": user_b, "alumni_id": user_a},
        ],
        "status": {"$in": ["pending", "accepted"]},
    })
    return mentorship is not None


@router.post("/{user_id}", status_code=201)
async def send_message(
    user_id: str,
    body: SendMessageRequest,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    sender_id = current_user["id"]

    if sender_id == user_id:
        raise HTTPException(status_code=400, detail="Cannot message yourself")
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")

    target = await db.users.find_one({"_id": ObjectId(user_id)})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if not await can_message(db, sender_id, user_id):
        raise HTTPException(status_code=403, detail="You can only message connected users")
    if not body.content.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty")

    doc = {
        "sender_id": sender_id,
        "receiver_id": user_id,
        "content": body.content.strip(),
        "read": False,
        "created_at": datetime.utcnow(),
    }
    result = await db.messages.insert_one(doc)

    # Notify receiver
    await create_notification(
        user_id=user_id,
        type=NotificationType.new_message,
        content=f"New message from {current_user['name']}",
        meta={"from_id": sender_id, "from_name": current_user["name"], "message_id": str(result.inserted_id)},
    )

    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/thread/{user_id}")
async def get_thread(
    user_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    my_id = current_user["id"]

    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID")
    if not await can_message(db, my_id, user_id):
        raise HTTPException(status_code=403, detail="You can only view threads with connected users")

    cursor = db.messages.find({
        "$or": [
            {"sender_id": my_id, "receiver_id": user_id},
            {"sender_id": user_id, "receiver_id": my_id},
        ]
    }).sort("created_at", 1)

    messages = []
    unread_ids = []
    async for msg in cursor:
        msg["id"] = str(msg.pop("_id"))
        messages.append(msg)
        if not msg["read"] and msg["receiver_id"] == my_id:
            unread_ids.append(ObjectId(msg["id"]))

    if unread_ids:
        await db.messages.update_many(
            {"_id": {"$in": unread_ids}},
            {"$set": {"read": True}},
        )
        for msg in messages:
            if msg["receiver_id"] == my_id:
                msg["read"] = True

    return messages


@router.get("/inbox")
async def inbox(current_user: dict = Depends(get_current_user)):
    db = get_db()
    my_id = current_user["id"]

    cursor = db.messages.find(
        {"$or": [{"sender_id": my_id}, {"receiver_id": my_id}]}
    ).sort("created_at", -1)

    threads: dict[str, dict] = {}
    async for msg in cursor:
        other_id = msg["receiver_id"] if msg["sender_id"] == my_id else msg["sender_id"]
        if other_id not in threads:
            threads[other_id] = {
                "last_message": msg["content"],
                "last_message_at": msg["created_at"],
                "unread_count": 0,
            }
        if not msg["read"] and msg["receiver_id"] == my_id:
            threads[other_id]["unread_count"] += 1

    if not threads:
        return []

    other_ids = [ObjectId(uid) for uid in threads.keys()]
    users_cursor = db.users.find({"_id": {"$in": other_ids}}, {"name": 1, "role": 1})

    result = []
    async for user in users_cursor:
        uid = str(user["_id"])
        thread = threads[uid]
        result.append({
            "user_id": uid,
            "user_name": user["name"],
            "user_role": user["role"],
            "last_message": thread["last_message"],
            "last_message_at": thread["last_message_at"],
            "unread_count": thread["unread_count"],
        })

    result.sort(key=lambda x: x["last_message_at"], reverse=True)
    return result


@router.patch("/{message_id}/read")
async def mark_read(
    message_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    if not ObjectId.is_valid(message_id):
        raise HTTPException(status_code=400, detail="Invalid message ID")

    msg = await db.messages.find_one({"_id": ObjectId(message_id)})
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    if msg["receiver_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your message to mark as read")

    await db.messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"read": True}})
    return {"message": "Marked as read"}


@router.get("/unread/count")
async def unread_count(current_user: dict = Depends(get_current_user)):
    db = get_db()
    count = await db.messages.count_documents({
        "receiver_id": current_user["id"],
        "read": False,
    })
    return {"unread_count": count}
