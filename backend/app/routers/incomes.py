"""Income API endpoints."""

from datetime import date

from fastapi import APIRouter, Query

from app.routers.deps import CurrentUser, DbSession
from app.schemas.income import (
    IncomeCreate,
    IncomeListResponse,
    IncomeResponse,
    IncomeUpdate,
)
from app.services.income_service import IncomeService

router = APIRouter(prefix="/api/incomes", tags=["Incomes"])


@router.get("/", response_model=IncomeListResponse)
def list_incomes(
    db: DbSession,
    current_user: CurrentUser,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    start_date: date | None = None,
    end_date: date | None = None,
    min_amount: float | None = None,
    max_amount: float | None = None,
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
):
    """Return paginated and filtered incomes."""
    return IncomeService.get_all(
        db,
        current_user.id,
        page,
        per_page,
        start_date,
        end_date,
        min_amount,
        max_amount,
        sort_order,
    )


@router.get("/recent", response_model=list[IncomeResponse])
def recent_incomes(
    db: DbSession,
    current_user: CurrentUser,
    limit: int = Query(5, ge=1, le=20),
):
    """Return recent incomes for the dashboard."""
    return IncomeService.get_recent(db, current_user.id, limit)


@router.post("/", response_model=IncomeResponse, status_code=201)
def create_income(
    data: IncomeCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Create a new income."""
    return IncomeService.create(db, data, current_user.id)


@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    data: IncomeUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Update an existing income."""
    return IncomeService.update(db, income_id, data, current_user.id)


@router.delete("/{income_id}", status_code=204)
def delete_income(
    income_id: int,
    db: DbSession,
    current_user: CurrentUser,
):
    """Delete an income."""
    IncomeService.delete(db, income_id, current_user.id)
