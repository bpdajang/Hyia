from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from models.user import UserRole
from schemas.profiles import UpdateStudentProfile
from utils.auth import get_current_user, require_role
from services.user_service import serialize_user

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/me")
async def get_my_profile(current_user: dict = Depends(require_role(UserRole.student))):
    return serialize_user(current_user)


@router.put("/me")
async def update_my_profile(
    body: UpdateStudentProfile,
    current_user: dict = Depends(require_role(UserRole.student)),
):
    db = get_db()
    updates = {}

    # Top-level fields
    if body.name is not None:
        updates["name"] = body.name

    # Profile sub-document fields
    profile_fields = ["university", "course", "year", "skills", "bio",
                      "github", "linkedin", "companies", "projects_completed"]
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


@router.get("/{student_id}")
async def get_student(student_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(student_id):
        raise HTTPException(status_code=400, detail="Invalid student ID")

    user = await db.users.find_one({"_id": ObjectId(student_id), "role": "student"})
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    return serialize_user(user)


@router.get("/")
async def list_students(_: dict = Depends(get_current_user)):
    db = get_db()
    cursor = db.users.find({"role": "student"}, {"hashed_password": 0, "skills_embedding": 0})
    students = []
    async for doc in cursor:
        doc["id"] = str(doc.pop("_id"))
        students.append(doc)
    return students
