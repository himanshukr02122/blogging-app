from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from app.models.user import User
from app.schemas.user import PaginatedUsers, Token, UserCreate, UserLogin, UserRead, UserRoleUpdate
from app.utils.enums import UserRole


class AuthError(ValueError):
    pass


def get_user_by_email(db: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email.lower().strip())
    return db.execute(statement).scalar_one_or_none()


def get_user_by_username(db: Session, username: str) -> User | None:
    statement = select(User).where(func.lower(User.name) == username.lower().strip())
    return db.execute(statement).scalar_one_or_none()


def get_user_by_id(db: Session, user_id: int) -> User | None:
    statement = select(User).where(User.id == user_id)
    return db.execute(statement).scalar_one_or_none()


def register_user(db: Session, payload: UserCreate) -> Token:
    existing_user = get_user_by_email(db, payload.email)
    existing_username = get_user_by_username(db, payload.username)
    if existing_user:
        raise AuthError("An account with this email already exists.")
    if existing_username:
        raise AuthError("This username is already taken.")

    user = User(
        name=payload.username.strip(),
        email=payload.email.lower().strip(),
        hashed_password=get_password_hash(payload.password),
        role=UserRole.AUTHOR.value,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role}
    )
    return Token(access_token=token, user=user)


def login_user(db: Session, payload: UserLogin) -> Token:
    identifier = payload.identifier.lower().strip()
    statement = select(User).where(
        or_(User.email == identifier, func.lower(User.name) == identifier)
    )
    user = db.execute(statement).scalar_one_or_none()
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise AuthError("Invalid username/email or password.")

    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role}
    )
    return Token(access_token=token, user=user)


def get_current_user_from_token(db: Session, token: str) -> User:
    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise AuthError("Invalid token.")

    user = get_user_by_id(db, int(user_id))
    if user is None:
        raise AuthError("User not found.")
    return user


def list_users(
    db: Session,
    *,
    page: int,
    page_size: int,
    search: str | None,
) -> PaginatedUsers:
    filters = []
    if search:
        search_term = f"%{search.lower().strip()}%"
        filters.append(
            or_(
                func.lower(User.name).like(search_term),
                func.lower(User.email).like(search_term),
            )
        )

    count_query = select(func.count(User.id))
    items_query = select(User).order_by(User.created_at.desc())

    if filters:
        count_query = count_query.where(*filters)
        items_query = items_query.where(*filters)

    total = db.execute(count_query).scalar_one()
    offset = (page - 1) * page_size
    users = db.execute(items_query.offset(offset).limit(page_size)).scalars().all()
    return PaginatedUsers(items=users, total=total, page=page, page_size=page_size)


def update_user_role(db: Session, user_id: int, payload: UserRoleUpdate) -> UserRead:
    user = get_user_by_id(db, user_id)
    if user is None:
        raise AuthError("User not found.")

    if user.role == UserRole.ADMIN.value and payload.role == UserRole.AUTHOR:
        admin_count = db.execute(
            select(func.count(User.id)).where(User.role == UserRole.ADMIN.value)
        ).scalar_one()
        if admin_count <= 1:
            raise AuthError("At least one admin user must remain.")

    user.role = payload.role.value
    db.commit()
    db.refresh(user)
    return user
