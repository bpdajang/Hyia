from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from utils.pyobjectid import PyObjectId


class ConnectionStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class ConnectionInDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    sender_id: str
    receiver_id: str
    status: ConnectionStatus = ConnectionStatus.pending
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
