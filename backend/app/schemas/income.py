"""Pydantic schemas for incomes."""

from datetime import date, datetime
from typing import Annotated

from pydantic import BaseModel, Field, field_validator

from app.services.service_utils import (
    SUPPORTED_CURRENCY_CODES,
    normalize_currency_code,
    normalize_optional_text,
)

AmountValue = Annotated[float, Field(gt=0, le=1_000_000_000)]
DescriptionText = Annotated[str, Field(min_length=2, max_length=255)]
SourceText = Annotated[str, Field(min_length=2, max_length=120)]


class IncomeCreate(BaseModel):
    """Schema for creating a new income entry."""

    amount: AmountValue
    description: DescriptionText
    income_date: date
    source: SourceText = "General"
    currency_code: str = "USD"

    @field_validator("description", "source")
    @classmethod
    def normalize_text_fields(cls, value: str) -> str:
        normalized = normalize_optional_text(value)
        if normalized is None:
            raise ValueError("Value is required")
        return normalized

    @field_validator("currency_code")
    @classmethod
    def validate_currency_code(cls, value: str) -> str:
        normalized = normalize_currency_code(value)
        if normalized not in SUPPORTED_CURRENCY_CODES:
            raise ValueError("Unsupported currency code")
        return normalized


class IncomeUpdate(BaseModel):
    """Schema for updating an income entry."""

    amount: AmountValue | None = None
    description: DescriptionText | None = None
    income_date: date | None = None
    source: SourceText | None = None
    currency_code: str | None = None

    @field_validator("description", "source")
    @classmethod
    def normalize_optional_text_fields(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = normalize_optional_text(value)
        if normalized is None:
            raise ValueError("Value cannot be blank")
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


class IncomeResponse(BaseModel):
    """Schema for income data returned to client."""

    id: int
    amount: float
    description: str
    income_date: date
    source: str
    currency_code: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class IncomeListResponse(BaseModel):
    """Paginated list of incomes."""

    items: list[IncomeResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
