from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from utils.pyobjectid import PyObjectId


class NotificationType(str, Enum):
    connection_request = "connection_request"
    connection_accepted = "connection_accepted"
    mentorship_request = "mentorship_request"
    mentorship_accepted = "mentorship_accepted"
    mentorship_rejected = "mentorship_rejected"
    mentorship_ended = "mentorship_ended"
    new_message = "new_message"
    application_update = "application_update"
    new_opportunity = "new_opportunity"


class NotificationInDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: str
    type: NotificationType
    content: str
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    meta: Optional[dict] = None  # extra context e.g. {"request_id": "...", "from_name": "..."}

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
