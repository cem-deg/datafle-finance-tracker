"""Pydantic schemas for expenses."""

from datetime import date, datetime
from typing import Annotated

from pydantic import BaseModel, Field, field_validator

from app.services.service_utils import (
    SUPPORTED_CURRENCY_CODES,
    normalize_currency_code,
    normalize_optional_text,
)

from app.schemas.category import CategoryResponse

AmountValue = Annotated[float, Field(gt=0, le=1_000_000_000)]
DescriptionText = Annotated[str, Field(min_length=2, max_length=255)]


class ExpenseCreate(BaseModel):
    """Schema for creating a new expense."""

    amount: AmountValue
    description: DescriptionText
    category_id: int
    expense_date: date
    currency_code: str = "USD"  # Default to USD

    @field_validator("description")
    @classmethod
    def normalize_description(cls, value: str) -> str:
        normalized = normalize_optional_text(value)
        if normalized is None:
            raise ValueError("Description is required")
        return normalized

    @field_validator("currency_code")
    @classmethod
    def validate_currency_code(cls, value: str) -> str:
        normalized = normalize_currency_code(value)
        if normalized not in SUPPORTED_CURRENCY_CODES:
            raise ValueError("Unsupported currency code")
        return normalized


class ExpenseUpdate(BaseModel):
    """Schema for updating an existing expense."""

    amount: AmountValue | None = None
    description: DescriptionText | None = None
    category_id: int | None = None
    expense_date: date | None = None
    currency_code: str | None = None

    @field_validator("description")
    @classmethod
    def normalize_optional_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = normalize_optional_text(value)
        if normalized is None:
            raise ValueError("Description cannot be blank")
        return normalized

    @field_validator("currency_code")
    @classmethod
    def validate_optional_currency_code(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = normalize_currency_code(value)
        if normalized not in SUPPORTED_CURRENCY_CODES:
            raise ValueError("Unsupported currency code")
        return normalized


class ExpenseResponse(BaseModel):
    """Schema for expense data returned to client."""
    id: int
    amount: float
    description: str
    expense_date: date
    category_id: int
    currency_code: str
    category: CategoryResponse
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ExpenseListResponse(BaseModel):
    """Paginated list of expenses."""
    items: list[ExpenseResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
