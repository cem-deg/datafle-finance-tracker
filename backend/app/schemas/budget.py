"""Pydantic schemas for budgets."""

from datetime import date, datetime
from decimal import Decimal
from typing import Annotated

from pydantic import BaseModel, Field, field_validator

from app.services.service_utils import (
    SUPPORTED_CURRENCY_CODES,
    normalize_currency_code,
    normalize_optional_text,
)

from app.schemas.category import CategoryResponse

AmountValue = Annotated[Decimal, Field(gt=0, le=1_000_000_000, max_digits=12, decimal_places=2)]
NoteText = Annotated[str, Field(min_length=2, max_length=255)]


class BudgetCreate(BaseModel):
    """Schema for creating or updating a budget."""

    amount: AmountValue
    currency_code: str = "USD"
    month_start: date
    category_id: int
    note: NoteText | None = None

    @field_validator("currency_code")
    @classmethod
    def validate_currency_code(cls, value: str) -> str:
        normalized = normalize_currency_code(value)
        if normalized not in SUPPORTED_CURRENCY_CODES:
            raise ValueError("Unsupported currency code")
        return normalized

    @field_validator("note")
    @classmethod
    def normalize_note(cls, value: str | None) -> str | None:
        return normalize_optional_text(value)


class BudgetUpdate(BaseModel):
    """Schema for updating an existing budget."""

    amount: AmountValue | None = None
    currency_code: str | None = None
    month_start: date | None = None
    category_id: int | None = None
    note: NoteText | None = None

    @field_validator("currency_code")
    @classmethod
    def validate_optional_currency_code(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = normalize_currency_code(value)
        if normalized not in SUPPORTED_CURRENCY_CODES:
            raise ValueError("Unsupported currency code")
        return normalized

    @field_validator("note")
    @classmethod
    def normalize_optional_note(cls, value: str | None) -> str | None:
        return normalize_optional_text(value)


class BudgetResponse(BaseModel):
    """Schema for budget data returned to client."""

    id: int
    amount: Decimal
    currency_code: str
    month_start: date
    category_id: int
    note: str | None = None
    created_at: datetime
    updated_at: datetime
    category: CategoryResponse

    model_config = {
        "from_attributes": True,
        "json_encoders": {Decimal: lambda value: float(value)},
    }
