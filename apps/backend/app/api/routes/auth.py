from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.user import Token, UserCreate, UserLogin
from app.services.auth_service import AuthError, login_user, register_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/sign-up", response_model=Token, status_code=status.HTTP_201_CREATED)
def sign_up(payload: UserCreate, db: Session = Depends(get_db)) -> Token:
    try:
        return register_user(db, payload)
    except AuthError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    try:
        return login_user(db, payload)
    except AuthError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        ) from exc
