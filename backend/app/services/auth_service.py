"""Authentication service - handles user registration, login, and JWT."""

from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.services.category_service import CategoryService
from app.services.crud_utils import safe_commit
from app.services.service_utils import normalize_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class AuthService:
    """Encapsulates all authentication logic."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a plain-text password using bcrypt."""
        return bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    @staticmethod
    def verify_password(plain: str, hashed: str) -> bool:
        """Verify a password against its bcrypt hash."""
        return bcrypt.checkpw(
            plain.encode("utf-8"), hashed.encode("utf-8")
        )

    @staticmethod
    def create_access_token(data: dict) -> str:
        """Generate a JWT access token."""
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def register(db: Session, user_data: UserCreate) -> User:
        """Register a new user. Raises HTTPException if email exists."""
        normalized_email = normalize_email(user_data.email)
        existing = (
            db.query(User)
            .filter(func.lower(User.email) == normalized_email)
            .first()
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user = User(
            email=normalized_email,
            name=user_data.name,
            hashed_password=AuthService.hash_password(user_data.password),
        )
        db.add(user)
        db.flush()
        CategoryService.seed_defaults(db, user)
        safe_commit(
            db,
            conflict_detail="Email already registered",
            failure_detail="Failed to create user",
        )
        db.refresh(user)
        return user

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> User:
        """Authenticate a user by email and password."""
        normalized_email = normalize_email(email)
        user = (
            db.query(User)
            .filter(func.lower(User.email) == normalized_email)
            .first()
        )
        if not user or not AuthService.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        return user


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
) -> User:
    """FastAPI dependency - extracts the current user from the JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        try:
            user_id = int(user_id)
        except (TypeError, ValueError) as exc:
            raise credentials_exception from exc
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user
