import logging
from datetime import datetime, timezone

from sqlalchemy import desc, select
from sqlalchemy.orm import Session, joinedload

from app.models.blog import Blog, BlogReviewComment
from app.models.user import User
from app.schemas.blog import BlogCreate, BlogReviewAction, BlogUpdate
from app.services.email_service import send_blog_approved_email
from app.utils.enums import BlogStatus

logger = logging.getLogger(__name__)


class BlogError(ValueError):
    pass


def _blog_query():
    return select(Blog).options(
        joinedload(Blog.author),
        joinedload(Blog.review_comments).joinedload(BlogReviewComment.admin),
    )

def get_blog_or_raise(db: Session, blog_id: int) -> Blog:
    blog = db.execute(_blog_query().where(Blog.id == blog_id)).unique().scalar_one_or_none()
    if blog is None:
        raise BlogError("Blog not found.")
    return blog

def list_published_blogs(db: Session) -> list[Blog]:
    result = db.execute(
        _blog_query()
        .where(Blog.status == BlogStatus.APPROVED.value)
        .order_by(desc(Blog.created_at))
    )
    return result.unique().scalars().all()

def list_user_blogs(db: Session, user: User) -> list[Blog]:
    result = db.execute(
        _blog_query().where(Blog.author_id == user.id).order_by(desc(Blog.updated_at))
    )
    return result.unique().scalars().all()

def create_blog(db: Session, user: User, payload: BlogCreate) -> Blog:
    blog = Blog(
        title=payload.title.strip(),
        summary=payload.summary.strip(),
        content=payload.content.strip(),
        tags=[tag.strip().lower() for tag in payload.tags if tag.strip()],
        author_id=user.id,
    )
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return get_blog_or_raise(db, blog.id)

def update_blog(db: Session, user: User, blog_id: int, payload: BlogUpdate) -> Blog:
    blog = get_blog_or_raise(db, blog_id)
    if blog.author_id != user.id:
        raise BlogError("You can only edit your own blogs.")
    if blog.status == BlogStatus.PENDING_REVIEW.value:
        raise BlogError("You cannot edit a blog while it is under review.")
    if blog.status == BlogStatus.APPROVED.value:
        raise BlogError("Approved blogs cannot be edited from this workflow.")

    if payload.title is not None:
        blog.title = payload.title.strip()
    if payload.summary is not None:
        blog.summary = payload.summary.strip()
    if payload.content is not None:
        blog.content = payload.content.strip()
    if payload.tags is not None:
        blog.tags = [tag.strip().lower() for tag in payload.tags if tag.strip()]

    blog.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(blog)
    return get_blog_or_raise(db, blog.id)

def submit_blog_for_review(db: Session, user: User, blog_id: int) -> Blog:
    blog = get_blog_or_raise(db, blog_id)
    if blog.author_id != user.id:
        raise BlogError("You can only submit your own blogs.")
    if blog.status not in {
        BlogStatus.DRAFT.value,
        BlogStatus.REJECTED.value,
        BlogStatus.WITHDRAWN.value,
    }:
        raise BlogError("This blog cannot be submitted in its current status.")

    blog.status = BlogStatus.PENDING_REVIEW.value
    blog.submitted_at = datetime.now(timezone.utc)
    blog.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(blog)
    return get_blog_or_raise(db, blog.id)

def withdraw_blog_submission(db: Session, user: User, blog_id: int) -> Blog:
    blog = get_blog_or_raise(db, blog_id)
    if blog.author_id != user.id:
        raise BlogError("You can only withdraw your own blogs.")
    if blog.status != BlogStatus.PENDING_REVIEW.value:
        raise BlogError("Only blogs under review can be withdrawn.")

    blog.status = BlogStatus.WITHDRAWN.value
    blog.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(blog)
    return get_blog_or_raise(db, blog.id)

def list_review_queue(
    db: Session,
    *,
    status: BlogStatus | None = None,
) -> list[Blog]:
    target_status = status.value if status else BlogStatus.PENDING_REVIEW.value
    result = db.execute(
        _blog_query().where(Blog.status == target_status).order_by(desc(Blog.submitted_at))
    )
    return result.unique().scalars().all()

def review_blog(db: Session, admin_user: User, blog_id: int, payload: BlogReviewAction) -> Blog:
    blog = get_blog_or_raise(db, blog_id)
    if blog.status != BlogStatus.PENDING_REVIEW.value:
        raise BlogError("Only pending blogs can be reviewed.")
    if payload.status not in {BlogStatus.APPROVED, BlogStatus.REJECTED}:
        raise BlogError("Blog review must approve or reject a submission.")

    blog.status = payload.status.value
    blog.reviewed_at = datetime.now(timezone.utc)
    blog.updated_at = datetime.now(timezone.utc)

    review_comment = BlogReviewComment(
        blog_id=blog.id,
        admin_id=admin_user.id,
        status=payload.status.value,
        comment=payload.comment.strip(),
    )
    db.add(review_comment)
    db.commit()
    db.refresh(blog)
    refreshed_blog = get_blog_or_raise(db, blog.id)

    if payload.status == BlogStatus.APPROVED:
        try:
            send_blog_approved_email(refreshed_blog, review_comment.comment)
        except Exception:
            logger.exception(
                "Failed to send approval email for blog %s to %s",
                refreshed_blog.id,
                refreshed_blog.author.email,
            )

    return refreshed_blog
