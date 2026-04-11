import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "Blogging App API")
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://blog_user:change_me@localhost:5432/blogging_app",
    )
    secret_key: str = os.getenv("SECRET_KEY", "change-me-in-production")
    algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "120")
    )
    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    admin_username: str = os.getenv("ADMIN_USERNAME", "admin")
    admin_email: str = os.getenv("ADMIN_EMAIL", "admin@blog.local")
    admin_password: str = os.getenv("ADMIN_PASSWORD", "Admin12345!")
    smtp_host: str = os.getenv("SMTP_HOST", "")
    smtp_port: int = int(os.getenv("SMTP_PORT", "587"))
    smtp_username: str = os.getenv("SMTP_USERNAME", "")
    smtp_password: str = os.getenv("SMTP_PASSWORD", "")
    smtp_from_email: str = os.getenv("SMTP_FROM_EMAIL", "no-reply@blog.local")
    smtp_from_name: str = os.getenv("SMTP_FROM_NAME", "Blogging App")
    smtp_use_tls: bool = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
    smtp_use_ssl: bool = os.getenv("SMTP_USE_SSL", "false").lower() == "true"


settings = Settings()
