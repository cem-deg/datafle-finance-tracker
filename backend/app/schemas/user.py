"""Pydantic schemas for user authentication."""

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, Field, field_validator

from app.services.service_utils import normalize_email, normalize_optional_text

NameStr = Annotated[str, Field(min_length=2, max_length=100)]
PasswordStr = Annotated[str, Field(min_length=8, max_length=128)]


class UserCreate(BaseModel):
    """Schema for user registration."""

    email: str
    name: NameStr
    password: PasswordStr

    @field_validator("email")
    @classmethod
    def normalize_email_value(cls, value: str) -> str:
        normalized = normalize_email(value)
        if "@" not in normalized or "." not in normalized.split("@")[-1]:
            raise ValueError("Enter a valid email address")
        return normalized

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        normalized = normalize_optional_text(value)
        if normalized is None:
            raise ValueError("Name is required")
        return normalized


class UserLogin(BaseModel):
    """Schema for user login."""

    email: str
    password: PasswordStr

    @field_validator("email")
    @classmethod
    def normalize_email_value(cls, value: str) -> str:
        normalized = normalize_email(value)
        if "@" not in normalized or "." not in normalized.split("@")[-1]:
            raise ValueError("Enter a valid email address")
        return normalized


class UserResponse(BaseModel):
    """Schema for user data returned to client."""
    id: int
    email: str
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
