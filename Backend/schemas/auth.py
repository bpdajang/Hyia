from typing import Optional
from pydantic import BaseModel, EmailStr
from models.user import UserRole, StudentProfile, AlumniProfile, CompanyProfile


# ─── Auth ─────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: str


# ─── Profile responses ────────────────────────────────────────────────────────

class StudentResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    profile: StudentProfile

    model_config = {"populate_by_name": True}


class AlumniResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    profile: AlumniProfile

    model_config = {"populate_by_name": True}


class CompanyResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    profile: CompanyProfile

    model_config = {"populate_by_name": True}


class MeResponse(BaseModel):
    """Generic /me response — client uses role field to decide which detail to fetch."""
    id: str
    name: str
    email: EmailStr
    role: UserRole
