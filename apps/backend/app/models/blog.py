from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.utils.enums import BlogStatus


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=BlogStatus.DRAFT.value,
        index=True,
        nullable=False,
    )
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    author = relationship("User", back_populates="blogs")
    review_comments = relationship(
        "BlogReviewComment",
        back_populates="blog",
        cascade="all, delete-orphan",
        order_by="BlogReviewComment.created_at.desc()",
    )


class BlogReviewComment(Base):
    __tablename__ = "blog_review_comments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    blog_id: Mapped[int] = mapped_column(ForeignKey("blogs.id"), nullable=False, index=True)
    admin_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    blog = relationship("Blog", back_populates="review_comments")
    admin = relationship("User", back_populates="review_comments")
