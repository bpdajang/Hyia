from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from utils.pyobjectid import PyObjectId


class UserRole(str, Enum):
    student = "student"
    alumni = "alumni"
    company = "company"


# ─── Base User ────────────────────────────────────────────────────────────────

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole


class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


# ─── Student ──────────────────────────────────────────────────────────────────

class StudentProfile(BaseModel):
    university: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    skills: list[str] = []
    bio: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    companies: list[str] = []
    projects_completed: list[str] = []
    profile_picture: Optional[str] = None
    skills_embedding: Optional[list[float]] = None


class StudentInDB(UserInDB):
    profile: StudentProfile = Field(default_factory=StudentProfile)


# ─── Alumni ───────────────────────────────────────────────────────────────────

class AlumniProfile(BaseModel):
    university: Optional[str] = None
    graduation_year: Optional[int] = None
    job_title: Optional[str] = None
    current_company: Optional[str] = None
    expertise: list[str] = []
    bio: Optional[str] = None
    availability: Optional[str] = None
    offerings: list[str] = []
    github: Optional[str] = None
    linkedin: Optional[str] = None
    mentor_capacity: int = 10
    current_mentees: int = 0
    profile_picture: Optional[str] = None
    skills_embedding: Optional[list[float]] = None


class AlumniInDB(UserInDB):
    profile: AlumniProfile = Field(default_factory=AlumniProfile)


# ─── Company ──────────────────────────────────────────────────────────────────

class CompanyProfile(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    intern_count: int = 0
    job_offer_count: int = 0
    project_count: int = 0


class CompanyInDB(UserInDB):
    profile: CompanyProfile = Field(default_factory=CompanyProfile)
