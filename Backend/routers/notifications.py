from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from utils.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# ─── Get all notifications ────────────────────────────────────────────────────

@router.get("/")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.notifications.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1)

    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result


# ─── Unread count ─────────────────────────────────────────────────────────────

@router.get("/unread/count")
async def unread_count(current_user: dict = Depends(get_current_user)):
    db = get_db()
    count = await db.notifications.count_documents({
        "user_id": current_user["id"],
        "read": False,
    })
    return {"unread_count": count}


# ─── Mark single notification as read ────────────────────────────────────────

@router.patch("/{notification_id}/read")
async def mark_one_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")

    notif = await db.notifications.find_one({"_id": ObjectId(notification_id)})
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notif["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your notification")

    await db.notifications.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"read": True}},
    )
    return {"message": "Marked as read"}


# ─── Mark all as read ─────────────────────────────────────────────────────────

@router.patch("/read-all")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    db = get_db()
    result = await db.notifications.update_many(
        {"user_id": current_user["id"], "read": False},
        {"$set": {"read": True}},
    )
    return {"message": f"Marked {result.modified_count} notifications as read"}


# ─── Delete single notification ───────────────────────────────────────────────

@router.delete("/{notification_id}", status_code=204)
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")

    notif = await db.notifications.find_one({"_id": ObjectId(notification_id)})
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notif["user_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your notification")

    await db.notifications.delete_one({"_id": ObjectId(notification_id)})


# ─── Clear all notifications ──────────────────────────────────────────────────

@router.delete("/clear-all", status_code=204)
async def clear_all(current_user: dict = Depends(get_current_user)):
    db = get_db()
    await db.notifications.delete_many({"user_id": current_user["id"]})
