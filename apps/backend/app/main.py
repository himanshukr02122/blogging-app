from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models.user import User


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Importing the model ensures SQLAlchemy knows about the table metadata.
    _ = User
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Backend running"}
