"""Authentication API endpoints."""

from fastapi import APIRouter

from app.routers.deps import CurrentUser, DbSession
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.services.auth_service import AuthService
from app.services.category_service import CategoryService

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
def register(user_data: UserCreate, db: DbSession):
    """Register a new user and return a JWT token."""
    user = AuthService.register(db, user_data)
    # Seed default categories for the new user
    CategoryService.seed_defaults(db, user)
    token = AuthService.create_access_token(data={"sub": str(user.id)})
    return Token(access_token=token, user=UserResponse.model_validate(user))


@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: DbSession):
    """Authenticate a user and return a JWT token."""
    user = AuthService.authenticate(db, credentials.email, credentials.password)
    token = AuthService.create_access_token(data={"sub": str(user.id)})
    return Token(access_token=token, user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def get_me(current_user: CurrentUser):
    """Return the currently authenticated user's profile."""
    return current_user
