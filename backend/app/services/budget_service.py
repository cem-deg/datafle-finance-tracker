"""Budget service - business logic for monthly budget management."""

from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.budget import Budget
from app.models.category import Category
from app.schemas.budget import BudgetCreate, BudgetUpdate
from app.services.crud_utils import (
    apply_updates,
    commit_and_refresh,
    delete_and_commit,
    get_or_error,
)


class BudgetService:
    """Handles budget operations."""

    @staticmethod
    def _normalize_month_start(value: date) -> date:
        """Store budgets by the first day of the target month."""
        return value.replace(day=1)

    @staticmethod
    def _ensure_category_belongs_to_user(
        db: Session, category_id: int, user_id: int
    ) -> None:
        """Ensure the given category belongs to the current user."""
        get_or_error(
            db.query(Category).filter(Category.id == category_id, Category.user_id == user_id),
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid category for this user",
        )

    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
        month_start: date | None = None,
    ) -> list[Budget]:
        """Return budgets for the given month or all budgets for the user."""
        query = (
            db.query(Budget)
            .options(joinedload(Budget.category))
            .filter(Budget.user_id == user_id)
        )
        if month_start:
            query = query.filter(
                Budget.month_start == BudgetService._normalize_month_start(month_start)
            )
        return query.order_by(Budget.month_start.desc(), Budget.created_at.desc()).all()

    @staticmethod
    def get_by_id(db: Session, budget_id: int, user_id: int) -> Budget:
        """Return a single budget by ID."""
        return get_or_error(
            db.query(Budget)
            .options(joinedload(Budget.category))
            .filter(Budget.id == budget_id, Budget.user_id == user_id),
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    @staticmethod
    def create(db: Session, data: BudgetCreate, user_id: int) -> Budget:
        """Create a new budget for a month/category pair."""
        BudgetService._ensure_category_belongs_to_user(db, data.category_id, user_id)
        normalized_month = BudgetService._normalize_month_start(data.month_start)

        existing = (
            db.query(Budget)
            .filter(
                Budget.user_id == user_id,
                Budget.category_id == data.category_id,
                Budget.month_start == normalized_month,
            )
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A budget already exists for this category and month",
            )

        budget = Budget(
            amount=data.amount,
            currency_code=data.currency_code,
            month_start=normalized_month,
            category_id=data.category_id,
            note=data.note,
            user_id=user_id,
        )
        db.add(budget)
        commit_and_refresh(
            db,
            budget,
            conflict_detail="A budget already exists for this category and month",
            failure_detail="Failed to create budget",
        )
        return BudgetService.get_by_id(db, budget.id, user_id)

    @staticmethod
    def update(db: Session, budget_id: int, data: BudgetUpdate, user_id: int) -> Budget:
        """Update an existing budget."""
        budget = BudgetService.get_by_id(db, budget_id, user_id)
        updates = data.model_dump(exclude_unset=True)

        category_id = updates.get("category_id", budget.category_id)
        month_start = updates.get("month_start", budget.month_start)
        BudgetService._ensure_category_belongs_to_user(db, category_id, user_id)
        updates["month_start"] = BudgetService._normalize_month_start(month_start)

        duplicate = (
            db.query(Budget)
            .filter(
                Budget.user_id == user_id,
                Budget.category_id == category_id,
                Budget.month_start == updates["month_start"],
                Budget.id != budget.id,
            )
            .first()
        )
        if duplicate:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A budget already exists for this category and month",
            )

        apply_updates(budget, updates)
        commit_and_refresh(
            db,
            budget,
            conflict_detail="A budget already exists for this category and month",
            failure_detail="Failed to update budget",
        )
        return BudgetService.get_by_id(db, budget.id, user_id)

    @staticmethod
    def delete(db: Session, budget_id: int, user_id: int) -> None:
        """Delete a budget."""
        budget = BudgetService.get_by_id(db, budget_id, user_id)
        delete_and_commit(db, budget, failure_detail="Failed to delete budget")
