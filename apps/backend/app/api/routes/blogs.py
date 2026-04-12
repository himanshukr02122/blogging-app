from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_admin_user, get_current_user, get_db
from app.schemas.blog import BlogCreate, BlogListResponse, BlogRead, BlogReviewAction, BlogUpdate
from app.services.blog_service import (
    BlogError,
    create_blog,
    get_blog_preview_or_raise,
    get_published_blog_or_raise,
    list_published_blogs,
    list_review_queue,
    list_user_blogs,
    review_blog,
    submit_blog_for_review,
    update_blog,
    withdraw_blog_submission,
)
from app.utils.enums import BlogStatus

router = APIRouter(prefix="/blogs", tags=["blogs"])
admin_router = APIRouter(prefix="/admin/blogs", tags=["admin-blogs"])


@router.get("", response_model=BlogListResponse)
def get_published_blogs(db: Session = Depends(get_db)) -> BlogListResponse:
    return BlogListResponse(items=list_published_blogs(db))


@router.get("/mine", response_model=BlogListResponse)
def get_my_blogs(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BlogListResponse:
    return BlogListResponse(items=list_user_blogs(db, current_user))


@router.get("/{blog_id}/preview", response_model=BlogRead)
def preview_blog(
    blog_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BlogRead:
    try:
        return get_blog_preview_or_raise(db, current_user, blog_id)
    except BlogError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc


@router.get("/{blog_id}", response_model=BlogRead)
def get_published_blog(blog_id: int, db: Session = Depends(get_db)) -> BlogRead:
    try:
        return get_published_blog_or_raise(db, blog_id)
    except BlogError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.post("", response_model=BlogRead, status_code=status.HTTP_201_CREATED)
def create_new_blog(
    payload: BlogCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BlogRead:
    try:
        return create_blog(db, current_user, payload)
    except BlogError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.patch("/{blog_id}", response_model=BlogRead)
def edit_blog(
    blog_id: int,
    payload: BlogUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BlogRead:
    try:
        return update_blog(db, current_user, blog_id, payload)
    except BlogError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/{blog_id}/submit", response_model=BlogRead)
def submit_blog(
    blog_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BlogRead:
    try:
        return submit_blog_for_review(db, current_user, blog_id)
    except BlogError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/{blog_id}/withdraw", response_model=BlogRead)
def withdraw_blog(
    blog_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> BlogRead:
    try:
        return withdraw_blog_submission(db, current_user, blog_id)
    except BlogError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@admin_router.get("/submissions", response_model=BlogListResponse)
def get_review_queue(
    review_status: BlogStatus | None = Query(default=None, alias="status"),
    _: object = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> BlogListResponse:
    return BlogListResponse(items=list_review_queue(db, status=review_status))


@admin_router.post("/{blog_id}/review", response_model=BlogRead)
def moderate_blog(
    blog_id: int,
    payload: BlogReviewAction,
    admin_user=Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> BlogRead:
    try:
        return review_blog(db, admin_user, blog_id, payload)
    except BlogError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
