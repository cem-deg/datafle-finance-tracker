"""Category service - business logic for category management."""

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.services.crud_utils import (
    apply_updates,
    commit_and_refresh,
    delete_and_commit,
    get_or_error,
)
from app.services.service_utils import normalize_optional_text

# Default categories seeded for every new user
DEFAULT_CATEGORIES = [
    {"name": "Food & Dining", "icon": "utensils", "color": "#ff6b6b"},
    {"name": "Transport", "icon": "car", "color": "#feca57"},
    {"name": "Shopping", "icon": "shopping-bag", "color": "#a29bfe"},
    {"name": "Entertainment", "icon": "gamepad-2", "color": "#fd79a8"},
    {"name": "Bills & Utilities", "icon": "receipt", "color": "#00cec9"},
    {"name": "Health", "icon": "heart-pulse", "color": "#00b894"},
    {"name": "Education", "icon": "graduation-cap", "color": "#6c5ce7"},
    {"name": "Other", "icon": "layers", "color": "#636e72"},
]


class CategoryService:
    """Handles all category-related operations."""

    @staticmethod
    def seed_defaults(db: Session, user: User) -> list[Category]:
        """Create default categories for a newly registered user."""
        categories = []
        for cat_data in DEFAULT_CATEGORIES:
            category = Category(
                name=cat_data["name"],
                icon=cat_data["icon"],
                color=cat_data["color"],
                is_default=True,
                user_id=user.id,
            )
            db.add(category)
            categories.append(category)
        return categories

    @staticmethod
    def _ensure_unique_name(
        db: Session,
        user_id: int,
        name: str,
        *,
        exclude_id: int | None = None,
    ) -> None:
        """Ensure a user does not create duplicate category names."""
        query = db.query(Category).filter(
            Category.user_id == user_id,
            func.lower(Category.name) == name.lower(),
        )
        if exclude_id is not None:
            query = query.filter(Category.id != exclude_id)
        if query.first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Category name already exists",
            )

    @staticmethod
    def get_all(db: Session, user_id: int) -> list[Category]:
        """Return all categories for a user (default + custom)."""
        return (
            db.query(Category)
            .filter(Category.user_id == user_id)
            .order_by(Category.name)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, category_id: int, user_id: int) -> Category:
        """Return a single category by ID, scoped to user."""
        return get_or_error(
            db.query(Category).filter(Category.id == category_id, Category.user_id == user_id),
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    @staticmethod
    def create(db: Session, data: CategoryCreate, user_id: int) -> Category:
        """Create a custom category for the user."""
        CategoryService._ensure_unique_name(db, user_id, data.name)
        category = Category(
            name=data.name,
            icon=data.icon,
            color=data.color,
            is_default=False,
            user_id=user_id,
        )
        db.add(category)
        commit_and_refresh(
            db,
            category,
            conflict_detail="Category name already exists",
            failure_detail="Failed to create category",
        )
        return category

    @staticmethod
    def update(
        db: Session, category_id: int, data: CategoryUpdate, user_id: int
    ) -> Category:
        """Update a category's attributes."""
        category = CategoryService.get_by_id(db, category_id, user_id)
        updates = data.model_dump(exclude_unset=True)
        normalized_name = normalize_optional_text(updates.get("name"))
        if normalized_name is not None:
            CategoryService._ensure_unique_name(
                db,
                user_id,
                normalized_name,
                exclude_id=category.id,
            )
            updates["name"] = normalized_name
        apply_updates(category, updates)
        commit_and_refresh(
            db,
            category,
            conflict_detail="Category name already exists",
            failure_detail="Failed to update category",
        )
        return category

    @staticmethod
    def delete(db: Session, category_id: int, user_id: int) -> None:
        """Delete a category if it has no expenses or budgets."""
        category = CategoryService.get_by_id(db, category_id, user_id)
        if category.expenses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete category with existing expenses",
            )
        if category.budgets:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete category with existing budgets",
            )
        delete_and_commit(db, category, failure_detail="Failed to delete category")
