"""Category API endpoints."""

from fastapi import APIRouter

from app.routers.deps import CurrentUser, DbSession
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services.category_service import CategoryService

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("/", response_model=list[CategoryResponse])
def list_categories(
    db: DbSession,
    current_user: CurrentUser,
):
    """Return all categories for the current user."""
    return CategoryService.get_all(db, current_user.id)


@router.post("/", response_model=CategoryResponse, status_code=201)
def create_category(
    data: CategoryCreate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Create a new custom category."""
    return CategoryService.create(db, data, current_user.id)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: DbSession,
    current_user: CurrentUser,
):
    """Update an existing category."""
    return CategoryService.update(db, category_id, data, current_user.id)


@router.delete("/{category_id}", status_code=204)
def delete_category(
    category_id: int,
    db: DbSession,
    current_user: CurrentUser,
):
    """Delete a category (only if it has no expenses)."""
    CategoryService.delete(db, category_id, current_user.id)
