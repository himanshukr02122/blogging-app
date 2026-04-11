from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.utils.enums import UserRole


class UserBase(BaseModel):
    username: str = Field(min_length=2, max_length=255)
    email: str = Field(min_length=5, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    identifier: str = Field(min_length=2, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: UserRole
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class UserRoleUpdate(BaseModel):
    role: UserRole


class UserListItem(UserRead):
    pass


class PaginatedUsers(BaseModel):
    items: list[UserListItem]
    total: int
    page: int
    page_size: int
