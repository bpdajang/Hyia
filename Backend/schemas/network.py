from typing import Optional
from enum import Enum
from pydantic import BaseModel
from datetime import datetime


class ConnectionStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class ConnectionResponse(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    status: ConnectionStatus
    created_at: datetime


class RespondRequest(BaseModel):
    action: ConnectionStatus  # "accepted" or "rejected"


class UserSummary(BaseModel):
    """Minimal user info returned in network lists."""
    id: str
    name: str
    email: str
    role: str
    department: Optional[str] = None
    skills: Optional[list[str]] = None
