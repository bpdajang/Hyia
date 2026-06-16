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
    department: Optional[str] = None
    program: Optional[str] = None
    year: Optional[int] = None
    skills: list[str] = []
    github: Optional[str] = None
    linkedin: Optional[str] = None
    companies: list[str] = []       # companies worked / interned at
    projects_completed: list[str] = []
    profile_picture: Optional[str] = None  # URL to profile picture
    skills_embedding: Optional[list[float]] = None  # set by ML phase


class StudentInDB(UserInDB):
    profile: StudentProfile = Field(default_factory=StudentProfile)


# ─── Alumni ───────────────────────────────────────────────────────────────────

class AlumniProfile(BaseModel):
    program_studied: Optional[str] = None
    department: Optional[str] = None
    graduation_year: Optional[int] = None
    current_company: Optional[str] = None
    skills: list[str] = []
    hobbies: list[str] = []
    github: Optional[str] = None
    linkedin: Optional[str] = None
    mentor_capacity: int = 10
    current_mentees: int = 0
    profile_picture: Optional[str] = None  # URL to profile picture
    skills_embedding: Optional[list[float]] = None


class AlumniInDB(UserInDB):
    profile: AlumniProfile = Field(default_factory=AlumniProfile)


# ─── Company ──────────────────────────────────────────────────────────────────

class CompanyProfile(BaseModel):
    company_name: Optional[str] = None
    company_type: Optional[str] = None
    year_established: Optional[int] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    intern_count: int = 0
    job_offer_count: int = 0
    project_count: int = 0


class CompanyInDB(UserInDB):
    profile: CompanyProfile = Field(default_factory=CompanyProfile)
