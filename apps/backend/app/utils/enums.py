from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    AUTHOR = "author"


class BlogStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"
