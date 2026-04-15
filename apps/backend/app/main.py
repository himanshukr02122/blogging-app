from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, select, text

from app.api.routes.admin import router as admin_router
from app.api.routes.auth import router as auth_router
from app.api.routes.blogs import admin_router as admin_blogs_router
from app.api.routes.blogs import router as blogs_router
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.blog import Blog, BlogReviewComment
from app.models.user import User
from app.utils.enums import UserRole

def ensure_admin_user() -> User:
    with SessionLocal() as db:
        # admin_user = db.execute(
        #     select(User).where(User.role == UserRole.ADMIN.value)
        # ).scalar_one_or_none()
        admin_user = db.execute(
            select(User).where(User.role == UserRole.ADMIN.value)
        ).scalars().first()
        if admin_user is None:
            existing_admin = db.execute(
                select(User).where(
                    (User.email == settings.admin_email.lower().strip())
                    | (User.name == settings.admin_username.strip())
                )
            ).scalar_one_or_none()
            if existing_admin is None:
                existing_admin = User(
                    name=settings.admin_username.strip(),
                    email=settings.admin_email.lower().strip(),
                    hashed_password=get_password_hash(settings.admin_password),
                    role=UserRole.ADMIN.value,
                )
                db.add(existing_admin)
            else:
                existing_admin.role = UserRole.ADMIN.value
                existing_admin.hashed_password = get_password_hash(settings.admin_password)
            db.commit()
            db.refresh(existing_admin)
            return existing_admin

        return admin_user

@asynccontextmanager
async def lifespan(_: FastAPI):
    _ = User
    _ = Blog
    _ = BlogReviewComment

    admin_user = ensure_admin_user()
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
app.include_router(blogs_router)
app.include_router(admin_router)
app.include_router(admin_blogs_router)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Backend running"}
