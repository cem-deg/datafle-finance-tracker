"""Budget service - business logic for monthly budget management."""

from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.models.budget import Budget
from app.models.category import Category
from app.schemas.budget import BudgetCreate, BudgetUpdate


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
        category = (
            db.query(Category)
            .filter(Category.id == category_id, Category.user_id == user_id)
            .first()
        )
        if not category:
            raise HTTPException(
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
        budget = (
            db.query(Budget)
            .options(joinedload(Budget.category))
            .filter(Budget.id == budget_id, Budget.user_id == user_id)
            .first()
        )
        if not budget:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Budget not found",
            )
        return budget

    @staticmethod
    def create(db: Session, data: BudgetCreate, user_id: int) -> Budget:
        """Create a new budget or replace the existing month/category budget."""
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
            existing.amount = data.amount
            existing.note = data.note
            db.commit()
            db.refresh(existing)
            return BudgetService.get_by_id(db, existing.id, user_id)

        budget = Budget(
            amount=data.amount,
            month_start=normalized_month,
            category_id=data.category_id,
            note=data.note,
            user_id=user_id,
        )
        db.add(budget)
        db.commit()
        db.refresh(budget)
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

        for field, value in updates.items():
            setattr(budget, field, value)
        db.commit()
        db.refresh(budget)
        return BudgetService.get_by_id(db, budget.id, user_id)

    @staticmethod
    def delete(db: Session, budget_id: int, user_id: int) -> None:
        """Delete a budget."""
        budget = BudgetService.get_by_id(db, budget_id, user_id)
        db.delete(budget)
        db.commit()
