from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin


class AuthError(ValueError):
    pass


def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email.lower().strip())
    return db.execute(statement).scalar_one_or_none()


def register_user(db: Session, payload: UserCreate) -> Token:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise AuthError("An account with this email already exists.")

    user = User(
        name=payload.name.strip(),
        email=payload.email.lower().strip(),
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token, user=user)


def login_user(db: Session, payload: UserLogin) -> Token:
    user = get_user_by_email(db, payload.email)
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise AuthError("Invalid email or password.")

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return Token(access_token=token, user=user)
