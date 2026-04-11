from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.user import UserRead
from app.utils.enums import BlogStatus


class BlogCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    summary: str = Field(min_length=10, max_length=500)
    content: str = Field(min_length=20)
    tags: list[str] = Field(default_factory=list)


class BlogUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=255)
    summary: str | None = Field(default=None, min_length=10, max_length=500)
    content: str | None = Field(default=None, min_length=20)
    tags: list[str] | None = None


class BlogReviewAction(BaseModel):
    status: BlogStatus
    comment: str = Field(min_length=3, max_length=1000)


class BlogReviewCommentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: BlogStatus
    comment: str
    created_at: datetime
    admin: UserRead


class BlogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    summary: str
    content: str
    tags: list[str]
    status: BlogStatus
    submitted_at: datetime | None
    reviewed_at: datetime | None
    created_at: datetime
    updated_at: datetime
    author: UserRead
    review_comments: list[BlogReviewCommentRead] = []


class BlogListResponse(BaseModel):
    items: list[BlogRead]
