from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from models.user import UserRole
from schemas.profiles import UpdateCompanyProfile
from utils.auth import get_current_user, require_role
from services.user_service import serialize_user

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("/me")
async def get_my_profile(current_user: dict = Depends(require_role(UserRole.company))):
    return serialize_user(current_user)


@router.put("/me")
async def update_my_profile(
    body: UpdateCompanyProfile,
    current_user: dict = Depends(require_role(UserRole.company)),
):
    db = get_db()
    updates = {}

    if body.name is not None:
        updates["name"] = body.name

    profile_fields = ["company_name", "industry", "size", "location",
                      "phone", "contact_email", "website", "description"]
    for field in profile_fields:
        val = getattr(body, field)
        if val is not None:
            updates[f"profile.{field}"] = val

    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    await db.users.update_one(
        {"_id": ObjectId(current_user["id"])},
        {"$set": updates}
    )

    updated = await db.users.find_one({"_id": ObjectId(current_user["id"])})
    return serialize_user(updated)


@router.get("/{company_id}")
async def get_company(company_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(company_id):
        raise HTTPException(status_code=400, detail="Invalid company ID")

    user = await db.users.find_one({"_id": ObjectId(company_id), "role": "company"})
    if not user:
        raise HTTPException(status_code=404, detail="Company not found")

    return serialize_user(user)


@router.get("/")
async def list_companies(_: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.users.find({"role": "company"}, {"hashed_password": 0})
    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result
