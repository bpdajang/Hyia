from datetime import datetime
from typing import Optional

from database.mongodb import get_db
from models.notification import NotificationType


async def create_notification(
    user_id: str,
    type: NotificationType,
    content: str,
    meta: Optional[dict] = None,
):
    """
    Internal helper — call this from any router to push a notification.

    Example:
        await create_notification(
            user_id=receiver_id,
            type=NotificationType.new_message,
            content="You have a new message from Kwame",
            meta={"from_id": sender_id, "from_name": "Kwame"}
        )
    """
    db = get_db()
    await db.notifications.insert_one({
        "user_id": user_id,
        "type": type.value,
        "content": content,
        "read": False,
        "created_at": datetime.utcnow(),
        "meta": meta or {},
    })
