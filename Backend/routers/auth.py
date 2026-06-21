from datetime import timedelta

from bson import ObjectId
from fastapi import APIRouter, HTTPException, status, Depends

from config.settings import settings
from database.mongodb import get_db
from models.user import UserRole, StudentInDB, AlumniInDB, CompanyInDB
from schemas.auth import RegisterRequest, LoginRequest, TokenResponse, MeResponse
from utils.security import hash_password, verify_password
from utils.auth import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])


# ─── Register ─────────────────────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    db = get_db()

    # Check duplicate email
    existing = await db.users.find_one({"email": body.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(body.password)
    base = {
        "name": body.name,
        "email": body.email,
        "hashed_password": hashed,
        "role": body.role.value,
    }

    # Build role-specific document
    if body.role == UserRole.student:
        doc = StudentInDB(**base, profile={}).model_dump(by_alias=True, exclude={"id"})
    elif body.role == UserRole.alumni:
        doc = AlumniInDB(**base, profile={}).model_dump(by_alias=True, exclude={"id"})
    elif body.role == UserRole.company:
        doc = CompanyInDB(**base, profile={}).model_dump(by_alias=True, exclude={"id"})
    else:
        raise HTTPException(status_code=400, detail="Invalid role")

    result = await db.users.insert_one(doc)
    return {"message": "Account created successfully", "user_id": str(result.inserted_id)}


# ─── Login ────────────────────────────────────────────────────────────────────

# from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest):
    db = get_db()

    user = await db.users.find_one({"email": body.email})
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return TokenResponse(
        access_token=token,
        role=user["role"],
        user_id=str(user["_id"]),
    )


# ─── Me ───────────────────────────────────────────────────────────────────────

@router.get("/me", response_model=MeResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return MeResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
    )
