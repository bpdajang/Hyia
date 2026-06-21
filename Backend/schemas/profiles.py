from typing import Optional
from pydantic import BaseModel


class UpdateStudentProfile(BaseModel):
    name: Optional[str] = None
    university: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    skills: Optional[list[str]] = None
    bio: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    companies: Optional[list[str]] = None
    projects_completed: Optional[list[str]] = None


class UpdateAlumniProfile(BaseModel):
    name: Optional[str] = None
    university: Optional[str] = None
    graduation_year: Optional[int] = None
    job_title: Optional[str] = None
    current_company: Optional[str] = None
    expertise: Optional[list[str]] = None
    bio: Optional[str] = None
    availability: Optional[str] = None
    offerings: Optional[list[str]] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    mentor_capacity: Optional[int] = None


class UpdateCompanyProfile(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
