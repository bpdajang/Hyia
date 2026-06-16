from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from models.opportunity import OpportunityType, ApplicationStatus


# ─── Requests ─────────────────────────────────────────────────────────────────

class CreateOpportunityRequest(BaseModel):
    title: str
    type: OpportunityType
    description: str
    required_skills: list[str] = []
    deadline: Optional[datetime] = None


class UpdateOpportunityRequest(BaseModel):
    title: Optional[str] = None
    type: Optional[OpportunityType] = None
    description: Optional[str] = None
    required_skills: Optional[list[str]] = None
    deadline: Optional[datetime] = None
    is_active: Optional[bool] = None


class UpdateApplicationStatusRequest(BaseModel):
    status: ApplicationStatus


# ─── Responses ────────────────────────────────────────────────────────────────

class OpportunityResponse(BaseModel):
    id: str
    title: str
    type: OpportunityType
    description: str
    required_skills: list[str]
    company_id: str
    company_name: str
    deadline: Optional[datetime]
    is_active: bool
    created_at: datetime


class ApplicationResponse(BaseModel):
    id: str
    opportunity_id: str
    applicant_id: str
    applicant_name: str
    applicant_role: str
    status: ApplicationStatus
    applied_at: datetime
