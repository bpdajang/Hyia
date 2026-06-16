from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
from utils.pyobjectid import PyObjectId


class OpportunityType(str, Enum):
    job = "job"
    internship = "internship"
    hackathon = "hackathon"
    project = "project"


class ApplicationStatus(str, Enum):
    applied = "applied"
    reviewed = "reviewed"
    accepted = "accepted"
    rejected = "rejected"


class OpportunityInDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    title: str
    type: OpportunityType
    description: str
    required_skills: list[str] = []
    company_id: str
    company_name: str
    deadline: Optional[datetime] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    skills_embedding: Optional[list[float]] = None  # set by ML phase

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class ApplicationInDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    opportunity_id: str
    applicant_id: str
    applicant_name: str
    applicant_role: str   # student or alumni
    status: ApplicationStatus = ApplicationStatus.applied
    applied_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
