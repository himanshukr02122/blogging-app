import logging
import smtplib
import ssl
from email.message import EmailMessage

from app.core.config import settings
from app.models.blog import Blog

logger = logging.getLogger(__name__)


def notifications_enabled() -> bool:
    return bool(settings.smtp_host and settings.smtp_from_email)


def send_blog_approved_email(blog: Blog, review_comment: str) -> None:
    if not notifications_enabled():
        logger.info(
            "Skipping approval email for blog %s because SMTP is not configured.",
            blog.id,
        )
        return

    message = EmailMessage()
    message["Subject"] = f"Your blog \"{blog.title}\" has been approved"
    message["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email}>"
    message["To"] = blog.author.email
    message.set_content(
        "\n".join(
            [
                f"Hi {blog.author.username},",
                "",
                f'Your blog "{blog.title}" has been approved and is now visible in the public blog list.',
                "",
                "Admin comment:",
                review_comment,
                "",
                f"View your app: {settings.frontend_origin}",
            ]
        )
    )

    context = ssl.create_default_context()

    if settings.smtp_use_ssl:
        with smtplib.SMTP_SSL(
            settings.smtp_host,
            settings.smtp_port,
            context=context,
        ) as server:
            if settings.smtp_username:
                server.login(settings.smtp_username, settings.smtp_password)
            server.send_message(message)
        return

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        if settings.smtp_use_tls:
            server.starttls(context=context)
        if settings.smtp_username:
            server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(message)
