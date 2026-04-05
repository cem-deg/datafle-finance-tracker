"""Pydantic schemas for incomes."""

from datetime import date, datetime

from pydantic import BaseModel


class IncomeCreate(BaseModel):
    """Schema for creating a new income entry."""

    amount: float
    description: str
    income_date: date
    source: str = "General"
    currency_code: str = "USD"


class IncomeUpdate(BaseModel):
    """Schema for updating an income entry."""

    amount: float | None = None
    description: str | None = None
    income_date: date | None = None
    source: str | None = None
    currency_code: str | None = None


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
