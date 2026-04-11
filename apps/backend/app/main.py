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


def migrate_users_table() -> None:
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("users")}
    if "role" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text("ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'author'")
            )


def ensure_admin_user() -> User:
    with SessionLocal() as db:
        admin_user = db.execute(
            select(User).where(User.role == UserRole.ADMIN.value)
        ).scalar_one_or_none()
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


def migrate_blogs_table(admin_user_id: int) -> None:
    inspector = inspect(engine)
    if "blogs" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("blogs")}
    statements: list[str] = []

    if "summary" not in columns:
      statements.append("ALTER TABLE blogs ADD COLUMN summary TEXT")
    if "tags" not in columns:
      statements.append("ALTER TABLE blogs ADD COLUMN tags JSON")
    if "status" not in columns:
      statements.append("ALTER TABLE blogs ADD COLUMN status VARCHAR(50)")
    if "author_id" not in columns:
      statements.append("ALTER TABLE blogs ADD COLUMN author_id INTEGER")
    if "submitted_at" not in columns:
      statements.append("ALTER TABLE blogs ADD COLUMN submitted_at TIMESTAMP WITH TIME ZONE")
    if "reviewed_at" not in columns:
      statements.append("ALTER TABLE blogs ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE")

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))

        connection.execute(text("UPDATE blogs SET summary = COALESCE(summary, LEFT(content, 500))"))
        connection.execute(text("UPDATE blogs SET tags = COALESCE(tags, '[]'::json)"))

        if "is_published" in columns:
            connection.execute(
                text(
                    """
                    UPDATE blogs
                    SET status = COALESCE(
                        status,
                        CASE
                            WHEN is_published = true THEN 'approved'
                            ELSE 'draft'
                        END
                    )
                    """
                )
            )
        else:
            connection.execute(text("UPDATE blogs SET status = COALESCE(status, 'draft')"))

        if "author" in columns:
            connection.execute(
                text(
                    """
                    UPDATE blogs AS b
                    SET author_id = u.id
                    FROM users AS u
                    WHERE b.author_id IS NULL
                      AND LOWER(TRIM(b.author)) = LOWER(TRIM(u.name))
                    """
                )
            )

        connection.execute(
            text("UPDATE blogs SET author_id = COALESCE(author_id, :admin_user_id)"),
            {"admin_user_id": admin_user_id},
        )


@asynccontextmanager
async def lifespan(_: FastAPI):
    _ = User
    _ = Blog
    _ = BlogReviewComment
    Base.metadata.create_all(bind=engine)

    migrate_users_table()
    admin_user = ensure_admin_user()
    migrate_blogs_table(admin_user.id)
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
