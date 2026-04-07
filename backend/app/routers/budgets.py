"""Budget API endpoints."""

from datetime import date

from fastapi import APIRouter

from app.routers.deps import CurrentUser, DbSession
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.services.budget_service import BudgetService

router = APIRouter(prefix="/api/budgets", tags=["Budgets"])


@router.get("/", response_model=list[BudgetResponse])
def list_budgets(
    db: DbSession,
    current_user: CurrentUser,
    month_start: date | None = None,
):
    """Return budgets for the current user."""
    return BudgetService.get_all(db, current_user.id, month_start)


@router.post("/", response_model=BudgetResponse, status_code=201)
def create_budget(
    data: BudgetCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Create a new budget."""
    return BudgetService.create(db, data, current_user.id)


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    data: BudgetUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Update an existing budget."""
    return BudgetService.update(db, budget_id, data, current_user.id)


@router.delete("/{budget_id}", status_code=204)
def delete_budget(
    budget_id: int,
    db: DbSession,
    current_user: CurrentUser,
):
    """Delete a budget."""
    BudgetService.delete(db, budget_id, current_user.id)
    return None
