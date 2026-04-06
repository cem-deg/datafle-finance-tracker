"""Small CRUD helpers to keep service code focused and DRY."""

from typing import Any

from fastapi import HTTPException
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


def commit_and_refresh(db: Session, entity: Any) -> None:
    """Commit the transaction and refresh the entity state."""
    db.commit()
    db.refresh(entity)
