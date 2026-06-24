from typing import Optional
from pydantic import BaseModel


class CreateCompanyPage(BaseModel):
    company_name: str
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None


class UpdateCompanyPage(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
