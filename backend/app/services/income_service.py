"""Income service - business logic for income management."""

from datetime import date

from fastapi import status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.models.income import Income
from app.schemas.income import IncomeCreate, IncomeListResponse, IncomeUpdate
from app.services.crud_utils import (
    apply_updates,
    commit_and_refresh,
    delete_and_commit,
    get_or_error,
    paginate_query,
)
from app.services.service_utils import validate_amount_range, validate_date_range


class IncomeService:
    """Handles all income-related operations."""

    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
        start_date: date | None = None,
        end_date: date | None = None,
        min_amount: float | None = None,
        max_amount: float | None = None,
        sort_order: str = "desc",
    ) -> IncomeListResponse:
        """Return paginated and filtered incomes."""
        validate_date_range(start_date, end_date, start_label="start_date", end_label="end_date")
        validate_amount_range(min_amount, max_amount)

        query = db.query(Income).filter(Income.user_id == user_id)
        if start_date:
            query = query.filter(Income.income_date >= start_date)
        if end_date:
            query = query.filter(Income.income_date <= end_date)
        if min_amount is not None:
            query = query.filter(Income.amount >= min_amount)
        if max_amount is not None:
            query = query.filter(Income.amount <= max_amount)

        query = query.order_by(
            Income.income_date if sort_order == "asc" else desc(Income.income_date)
        )
        total, items, total_pages = paginate_query(query, page=page, per_page=per_page)
        return IncomeListResponse(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
        )

    @staticmethod
    def get_recent(db: Session, user_id: int, limit: int = 5) -> list[Income]:
        """Return the most recent income entries."""
        return (
            db.query(Income)
            .filter(Income.user_id == user_id)
            .order_by(desc(Income.income_date), desc(Income.created_at))
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, income_id: int, user_id: int) -> Income:
        """Return a single income by ID, scoped to user."""
        return get_or_error(
            db.query(Income).filter(Income.id == income_id, Income.user_id == user_id),
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Income not found",
        )

    @staticmethod
    def create(db: Session, data: IncomeCreate, user_id: int) -> Income:
        """Create a new income entry."""
        income = Income(
            amount=data.amount,
            description=data.description,
            income_date=data.income_date,
            source=data.source,
            currency_code=data.currency_code,
            user_id=user_id,
        )
        db.add(income)
        commit_and_refresh(db, income, failure_detail="Failed to create income")
        return income

    @staticmethod
    def update(db: Session, income_id: int, data: IncomeUpdate, user_id: int) -> Income:
        """Update an existing income entry."""
        income = IncomeService.get_by_id(db, income_id, user_id)
        apply_updates(income, data.model_dump(exclude_unset=True))
        commit_and_refresh(db, income, failure_detail="Failed to update income")
        return income

    @staticmethod
    def delete(db: Session, income_id: int, user_id: int) -> None:
        """Delete an income entry."""
        income = IncomeService.get_by_id(db, income_id, user_id)
        delete_and_commit(db, income, failure_detail="Failed to delete income")
