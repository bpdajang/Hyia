from datetime import datetime
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends, Query

from database.mongodb import get_db
from models.notification import NotificationType
from models.opportunity import OpportunityType, ApplicationStatus
from models.user import UserRole
from schemas.opportunity import (
    CreateOpportunityRequest,
    UpdateOpportunityRequest,
    UpdateApplicationStatusRequest,
)
from services.notification_service import create_notification
from utils.auth import get_current_user, require_role

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])


def serialize_doc(doc: dict) -> dict:
    if doc:
        doc["id"] = str(doc.pop("_id", ""))
        doc.pop("skills_embedding", None)
    return doc


@router.post("/", status_code=201)
async def create_opportunity(
    body: CreateOpportunityRequest,
    current_user: dict = Depends(require_role(UserRole.company)),
):
    db = get_db()
    doc = {
        "title": body.title,
        "type": body.type.value,
        "description": body.description,
        "required_skills": body.required_skills,
        "company_id": current_user["id"],
        "company_name": current_user.get("profile", {}).get("company_name") or current_user["name"],
        "deadline": body.deadline,
        "is_active": True,
        "created_at": datetime.utcnow(),
        "skills_embedding": None,
    }
    result = await db.opportunities.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/")
async def list_opportunities(
    type: Optional[OpportunityType] = Query(default=None),
    skill: Optional[str] = Query(default=None),
    _: dict = Depends(get_current_user),
):
    db = get_db()
    query: dict = {"is_active": True}
    if type:
        query["type"] = type.value
    if skill:
        query["required_skills"] = {"$in": [skill]}

    cursor = db.opportunities.find(query, {"skills_embedding": 0})
    result = []
    async for doc in cursor:
        result.append(serialize_doc(doc))
    return result


@router.get("/my/applications")
async def my_applications(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ("student", "alumni"):
        raise HTTPException(status_code=403, detail="Only students and alumni can view applications")
    db = get_db()
    cursor = db.applications.find({"applicant_id": current_user["id"]})
    result = []
    async for app in cursor:
        app["id"] = str(app.pop("_id"))
        result.append(app)
    return result


@router.get("/my/postings")
async def my_postings(current_user: dict = Depends(require_role(UserRole.company))):
    db = get_db()
    cursor = db.opportunities.find({"company_id": current_user["id"]}, {"skills_embedding": 0})
    result = []
    async for doc in cursor:
        result.append(serialize_doc(doc))
    return result


@router.get("/{opportunity_id}")
async def get_opportunity(opportunity_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(opportunity_id):
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")
    doc = await db.opportunities.find_one({"_id": ObjectId(opportunity_id)}, {"skills_embedding": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return serialize_doc(doc)


@router.put("/{opportunity_id}")
async def update_opportunity(
    opportunity_id: str,
    body: UpdateOpportunityRequest,
    current_user: dict = Depends(require_role(UserRole.company)),
):
    db = get_db()
    if not ObjectId.is_valid(opportunity_id):
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")

    opp = await db.opportunities.find_one({"_id": ObjectId(opportunity_id)})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    if opp["company_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your opportunity")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    if "type" in updates:
        updates["type"] = updates["type"].value

    await db.opportunities.update_one({"_id": ObjectId(opportunity_id)}, {"$set": updates})
    updated = await db.opportunities.find_one({"_id": ObjectId(opportunity_id)}, {"skills_embedding": 0})
    return serialize_doc(updated)


@router.delete("/{opportunity_id}", status_code=204)
async def delete_opportunity(
    opportunity_id: str,
    current_user: dict = Depends(require_role(UserRole.company)),
):
    db = get_db()
    if not ObjectId.is_valid(opportunity_id):
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")
    opp = await db.opportunities.find_one({"_id": ObjectId(opportunity_id)})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    if opp["company_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your opportunity")
    await db.opportunities.delete_one({"_id": ObjectId(opportunity_id)})


@router.post("/{opportunity_id}/apply", status_code=201)
async def apply(
    opportunity_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    if current_user["role"] not in ("student", "alumni"):
        raise HTTPException(status_code=403, detail="Only students and alumni can apply")
    if not ObjectId.is_valid(opportunity_id):
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")

    opp = await db.opportunities.find_one({"_id": ObjectId(opportunity_id)})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    if not opp.get("is_active"):
        raise HTTPException(status_code=400, detail="This opportunity is no longer active")

    existing = await db.applications.find_one({
        "opportunity_id": opportunity_id,
        "applicant_id": current_user["id"],
    })
    if existing:
        raise HTTPException(status_code=400, detail="You have already applied")

    doc = {
        "opportunity_id": opportunity_id,
        "applicant_id": current_user["id"],
        "applicant_name": current_user["name"],
        "applicant_role": current_user["role"],
        "status": ApplicationStatus.applied.value,
        "applied_at": datetime.utcnow(),
        "updated_at": None,
    }
    result = await db.applications.insert_one(doc)

    # Notify the company
    await create_notification(
        user_id=opp["company_id"],
        type=NotificationType.new_opportunity,
        content=f"{current_user['name']} applied for '{opp['title']}'",
        meta={"applicant_id": current_user["id"], "opportunity_id": opportunity_id, "application_id": str(result.inserted_id)},
    )

    return {"message": "Application submitted", "application_id": str(result.inserted_id)}


@router.get("/{opportunity_id}/applicants")
async def get_applicants(
    opportunity_id: str,
    current_user: dict = Depends(require_role(UserRole.company)),
):
    db = get_db()
    if not ObjectId.is_valid(opportunity_id):
        raise HTTPException(status_code=400, detail="Invalid opportunity ID")
    opp = await db.opportunities.find_one({"_id": ObjectId(opportunity_id)})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    if opp["company_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your opportunity")

    cursor = db.applications.find({"opportunity_id": opportunity_id})
    result = []
    async for app in cursor:
        app["id"] = str(app.pop("_id"))
        result.append(app)
    return result


@router.patch("/{opportunity_id}/applicants/{application_id}")
async def update_application_status(
    opportunity_id: str,
    application_id: str,
    body: UpdateApplicationStatusRequest,
    current_user: dict = Depends(require_role(UserRole.company)),
):
    db = get_db()

    opp = await db.opportunities.find_one({"_id": ObjectId(opportunity_id)})
    if not opp or opp["company_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not your opportunity")
    if not ObjectId.is_valid(application_id):
        raise HTTPException(status_code=400, detail="Invalid application ID")

    application = await db.applications.find_one({"_id": ObjectId(application_id)})
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    await db.applications.update_one(
        {"_id": ObjectId(application_id)},
        {"$set": {"status": body.status.value, "updated_at": datetime.utcnow()}},
    )

    # Notify the applicant
    await create_notification(
        user_id=application["applicant_id"],
        type=NotificationType.application_update,
        content=f"Your application for '{opp['title']}' was marked as {body.status.value}",
        meta={"opportunity_id": opportunity_id, "status": body.status.value, "company_name": current_user.get("profile", {}).get("company_name") or current_user["name"]},
    )

    return {"message": f"Application marked as {body.status.value}"}
