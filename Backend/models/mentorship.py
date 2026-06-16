from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from utils.pyobjectid import PyObjectId


class MentorshipStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    ended = "ended"


class MentorshipRequestInDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    student_id: str
    student_name: str
    alumni_id: str
    alumni_name: str
    message: str
    status: MentorshipStatus = MentorshipStatus.pending
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
