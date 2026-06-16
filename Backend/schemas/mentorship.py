from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from models.mentorship import MentorshipStatus


class SendMentorshipRequest(BaseModel):
    message: str


class RespondMentorshipRequest(BaseModel):
    action: MentorshipStatus  # "accepted" or "rejected"


class MentorshipResponse(BaseModel):
    id: str
    student_id: str
    student_name: str
    alumni_id: str
    alumni_name: str
    message: str
    status: MentorshipStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
