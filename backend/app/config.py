"""Application configuration loaded from environment variables."""

import os
from dotenv import load_dotenv

load_dotenv()


def _parse_bool(value: str | None, default: bool) -> bool:
    """Parse a truthy/falsy environment variable."""
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _parse_csv(value: str | None, default: list[str]) -> list[str]:
    """Parse a comma-separated environment variable into a list."""
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings:
    """Central configuration for the Datafle backend."""

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./datafle.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440")
    )
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    EXCHANGE_API_KEY: str = os.getenv("EXCHANGE_API_KEY", "")
    AUTO_CREATE_TABLES: bool = _parse_bool(
        os.getenv("AUTO_CREATE_TABLES"), default=True
    )
    CORS_ORIGINS: list[str] = _parse_csv(
        os.getenv("CORS_ORIGINS"),
        default=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
        ],
    )


settings = Settings()
