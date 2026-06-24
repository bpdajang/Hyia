from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends

from database.mongodb import get_db
from schemas.company_page import CreateCompanyPage, UpdateCompanyPage
from utils.auth import get_current_user

router = APIRouter(prefix="/company-pages", tags=["Company Pages"])


def _serialize(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.post("/", status_code=201)
async def create_company_page(
    body: CreateCompanyPage,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    doc = {
        "owner_id": current_user["id"],
        "owner_name": current_user.get("name", ""),
        "company_name": body.company_name,
        "industry": body.industry,
        "size": body.size,
        "location": body.location,
        "phone": body.phone,
        "contact_email": body.contact_email,
        "website": body.website,
        "description": body.description,
        "created_at": datetime.utcnow(),
    }
    result = await db.company_pages.insert_one(doc)
    created = await db.company_pages.find_one({"_id": result.inserted_id})
    return _serialize(created)


@router.get("/my")
async def get_my_company_pages(current_user: dict = Depends(get_current_user)):
    db = get_db()
    pages = []
    async for doc in db.company_pages.find({"owner_id": current_user["id"]}):
        pages.append(_serialize(doc))
    return pages


@router.get("/")
async def list_company_pages(_: dict = Depends(get_current_user)):
    db = get_db()
    pages = []
    async for doc in db.company_pages.find():
        pages.append(_serialize(doc))
    return pages


@router.get("/{page_id}")
async def get_company_page(page_id: str, _: dict = Depends(get_current_user)):
    db = get_db()
    if not ObjectId.is_valid(page_id):
        raise HTTPException(status_code=400, detail="Invalid page ID")
    doc = await db.company_pages.find_one({"_id": ObjectId(page_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Company page not found")
    return _serialize(doc)


@router.put("/{page_id}")
async def update_company_page(
    page_id: str,
    body: UpdateCompanyPage,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    if not ObjectId.is_valid(page_id):
        raise HTTPException(status_code=400, detail="Invalid page ID")
    doc = await db.company_pages.find_one({"_id": ObjectId(page_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Company page not found")
    if doc["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="You do not own this company page")

    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")

    await db.company_pages.update_one({"_id": ObjectId(page_id)}, {"$set": updates})
    updated = await db.company_pages.find_one({"_id": ObjectId(page_id)})
    return _serialize(updated)


@router.delete("/{page_id}", status_code=204)
async def delete_company_page(
    page_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()
    if not ObjectId.is_valid(page_id):
        raise HTTPException(status_code=400, detail="Invalid page ID")
    doc = await db.company_pages.find_one({"_id": ObjectId(page_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Company page not found")
    if doc["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="You do not own this company page")
    await db.company_pages.delete_one({"_id": ObjectId(page_id)})
