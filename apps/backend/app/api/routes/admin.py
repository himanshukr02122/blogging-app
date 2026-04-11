from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_admin_user, get_db
from app.schemas.user import PaginatedUsers, UserRead, UserRoleUpdate
from app.services.auth_service import AuthError, list_users, update_user_role

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=PaginatedUsers)
def get_users(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=10, ge=1, le=50),
    search: str | None = Query(default=None),
    _: object = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> PaginatedUsers:
    return list_users(db, page=page, page_size=page_size, search=search)


@router.patch("/users/{user_id}/role", response_model=UserRead)
def change_user_role(
    user_id: int,
    payload: UserRoleUpdate,
    _: object = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> UserRead:
    try:
        return update_user_role(db, user_id, payload)
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
