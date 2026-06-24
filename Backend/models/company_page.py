from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from utils.pyobjectid import PyObjectId


class CompanyPageInDB(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    owner_id: str
    owner_name: str
    company_name: str
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    contact_email: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
