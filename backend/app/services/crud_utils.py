"""Small CRUD helpers to keep service code focused and DRY."""

import math
from typing import Any

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Query, Session


def get_or_error(query: Query, *, status_code: int, detail: str):
    """Return the first row from a query or raise an HTTP error."""
    entity = query.first()
    if entity is None:
        raise HTTPException(status_code=status_code, detail=detail)
    return entity


def apply_updates(entity: Any, updates: dict[str, Any]) -> None:
    """Apply partial updates to an ORM entity."""
    for field, value in updates.items():
        setattr(entity, field, value)


def safe_commit(
    db: Session,
    *,
    conflict_detail: str = "Request conflicts with existing data",
    failure_detail: str = "Failed to save changes",
) -> None:
    """Commit a transaction and convert DB failures into stable API errors."""
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail=conflict_detail) from exc
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=failure_detail) from exc


def commit_and_refresh(
    db: Session,
    entity: Any,
    *,
    conflict_detail: str = "Request conflicts with existing data",
    failure_detail: str = "Failed to save changes",
) -> None:
    """Commit the transaction and refresh the entity state."""
    safe_commit(
        db,
        conflict_detail=conflict_detail,
        failure_detail=failure_detail,
    )
    db.refresh(entity)


def delete_and_commit(
    db: Session,
    entity: Any,
    *,
    failure_detail: str = "Failed to delete record",
) -> None:
    """Delete an ORM entity and commit the transaction safely."""
    db.delete(entity)
    safe_commit(db, failure_detail=failure_detail)


def paginate_query(query: Query, *, page: int, per_page: int) -> tuple[int, list[Any], int]:
    """Apply offset/limit pagination and return total count, items, and total pages."""
    total = query.count()
    offset = (page - 1) * per_page
    items = query.offset(offset).limit(per_page).all()
    total_pages = math.ceil(total / per_page) if per_page > 0 else 0
    return total, items, total_pages
