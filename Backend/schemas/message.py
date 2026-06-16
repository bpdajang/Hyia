from datetime import datetime
from pydantic import BaseModel


class SendMessageRequest(BaseModel):
    content: str


class MessageResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    content: str
    read: bool
    created_at: datetime


class ConversationSummary(BaseModel):
    """One entry in the inbox — last message + unread count per thread."""
    user_id: str
    user_name: str
    user_role: str
    last_message: str
    last_message_at: datetime
    unread_count: int
