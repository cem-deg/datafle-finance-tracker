"""Datafle backend FastAPI application entry point."""

import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import Base, engine
from app.routers import analytics, auth, budgets, categories, expenses, incomes, insights
from app.schemas.analytics import ErrorResponse, ErrorDetailItem, HealthResponse

logger = logging.getLogger(__name__)

# Create all database tables on startup when explicitly enabled.
if settings.AUTO_CREATE_TABLES:
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Datafle API",
    description="Personal finance tracker with smart insights",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(expenses.router)
app.include_router(incomes.router)
app.include_router(budgets.router)
app.include_router(analytics.router)
app.include_router(insights.router)

if settings.uses_insecure_secret_key:
    if settings.has_non_local_cors_origin:
        raise RuntimeError(
            "Refusing to start with the default SECRET_KEY when non-local CORS origins are configured."
        )
    logger.warning(
        "Using the built-in development SECRET_KEY. Set SECRET_KEY in the environment before deploying."
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    _request: Request, exc: RequestValidationError
):
    """Return a stable validation error contract for frontend consumers."""
    errors = [
        ErrorDetailItem(
            field=".".join(str(part) for part in error["loc"][1:]) or "request",
            message=error["msg"],
        )
        for error in exc.errors()
    ]
    detail = errors[0].message if errors else "Validation failed"
    payload = ErrorResponse(detail=detail, errors=errors)
    return JSONResponse(status_code=422, content=payload.model_dump())


@app.get("/api/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """Simple health check endpoint."""
    return HealthResponse(status="healthy", app="Datafle", version="1.0.0")
