"""Pydantic schemas for categories."""

from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, Field, field_validator

from app.services.service_utils import normalize_optional_text

CategoryName = Annotated[str, Field(min_length=2, max_length=100)]
IconName = Annotated[str, Field(min_length=2, max_length=50)]
HexColor = Annotated[str, Field(min_length=7, max_length=7, pattern=r"^#[0-9A-Fa-f]{6}$")]


class CategoryCreate(BaseModel):
    """Schema for creating a new category."""

    name: CategoryName
    icon: IconName = "circle"
    color: HexColor = "#6c5ce7"

    @field_validator("name", "icon")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        normalized = normalize_optional_text(value)
        if normalized is None:
            raise ValueError("Value is required")
        return normalized


class CategoryUpdate(BaseModel):
    """Schema for updating an existing category."""

    name: CategoryName | None = None
    icon: IconName | None = None
    color: HexColor | None = None

    @field_validator("name", "icon")
    @classmethod
    def normalize_optional_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = normalize_optional_text(value)
        if normalized is None:
            raise ValueError("Value cannot be blank")
        return normalized


class CategoryResponse(BaseModel):
    """Schema for category data returned to client."""
    id: int
    name: str
    icon: str
    color: str
    is_default: bool
    created_at: datetime

    model_config = {"from_attributes": True}
