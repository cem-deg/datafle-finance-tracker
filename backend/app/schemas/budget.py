"""Pydantic schemas for budgets."""

from datetime import date, datetime

from pydantic import BaseModel

from app.schemas.category import CategoryResponse


class BudgetCreate(BaseModel):
    """Schema for creating or updating a budget."""

    amount: float
    month_start: date
    category_id: int
    note: str | None = None


class BudgetUpdate(BaseModel):
    """Schema for updating an existing budget."""

    amount: float | None = None
    month_start: date | None = None
    category_id: int | None = None
    note: str | None = None


class BudgetResponse(BaseModel):
    """Schema for budget data returned to client."""

    id: int
    amount: float
    month_start: date
    category_id: int
    note: str | None = None
    created_at: datetime
    updated_at: datetime
    category: CategoryResponse

    model_config = {"from_attributes": True}
