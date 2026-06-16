from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from models.user import UserRole
from schemas.profiles import UpdateAlumniProfile
from utils.auth import get_current_user, require_role
from services.user_service import serialize_user

router = APIRouter(prefix="/alumni", tags=["Alumni"])


@router.get("/me")
async def get_my_profile(current_user: dict = Depends(require_role(UserRole.alumni))):
    return serialize_user(current_user)


@router.put("/me")
async def update_my_profile(
    body: UpdateAlumniProfile,
    current_user: dict = Depends(require_role(UserRole.alumni)),
):
    db = get_db()
    updates = {}

    if body.name is not None:
        updates["name"] = body.name

    profile_fields = ["department", "program_studied", "skills", "hobbies",
                      "github", "linkedin", "max_mentees"]
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


@router.get("/available")
async def available_mentors(_: dict = Depends(get_current_user)):
    """List alumni who still have mentee capacity."""
    db = get_db()
    cursor = db.users.find(
        {
            "role": "alumni",
            "$expr": {"$lt": ["$profile.current_mentees", "$profile.mentor_capacity"]},
        },
        {"hashed_password": 0, "skills_embedding": 0},
    )
    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result


@router.get("/{alumni_id}")
async def get_alumni(alumni_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(alumni_id):
        raise HTTPException(status_code=400, detail="Invalid alumni ID")

    user = await db.users.find_one({"_id": ObjectId(alumni_id), "role": "alumni"})
    if not user:
        raise HTTPException(status_code=404, detail="Alumni not found")

    return serialize_user(user)


@router.get("/")
async def list_alumni(_: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.users.find({"role": "alumni"}, {"hashed_password": 0, "skills_embedding": 0})
    result = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        result.append(doc)
    return result
