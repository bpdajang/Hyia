from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from database.mongodb import connect_db, close_db
from routers.auth import router as auth_router
from routers.students import router as students_router
from routers.alumni import router as alumni_router
from routers.companies import router as companies_router
from routers.network import router as network_router
from routers.opportunities import router as opportunities_router
from routers.messages import router as messages_router
from routers.notifications import router as notifications_router
from routers.mentorship import router as mentorship_router
from routers.company_pages import router as company_pages_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Hyia API",
    description="Intelligent Academic-Industry Social Network",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api/v1"

app.include_router(auth_router, prefix=PREFIX)
app.include_router(students_router, prefix=PREFIX)
app.include_router(alumni_router, prefix=PREFIX)
app.include_router(companies_router, prefix=PREFIX)
app.include_router(network_router, prefix=PREFIX)
app.include_router(opportunities_router, prefix=PREFIX)
app.include_router(mentorship_router, prefix=PREFIX)
app.include_router(messages_router, prefix=PREFIX)
app.include_router(notifications_router, prefix=PREFIX)
app.include_router(company_pages_router, prefix=PREFIX)


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "CampusBridge API is running"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
    