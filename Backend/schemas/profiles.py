from typing import Optional
from pydantic import BaseModel


class UpdateStudentProfile(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    program: Optional[str] = None
    year: Optional[int] = None
    skills: Optional[list[str]] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    companies: Optional[list[str]] = None
    projects_completed: Optional[list[str]] = None


class UpdateAlumniProfile(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    program_studied: Optional[str] = None
    skills: Optional[list[str]] = None
    hobbies: Optional[list[str]] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    max_mentees: Optional[int] = None


class UpdateCompanyProfile(BaseModel):
    name: Optional[str] = None
    company_name: Optional[str] = None
    company_type: Optional[str] = None
    year_established: Optional[int] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
