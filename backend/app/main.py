"""Datafle Backend — FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth, budgets, categories, expenses, analytics, incomes, insights

# Create all database tables on startup
if settings.AUTO_CREATE_TABLES:
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Datafle API",
    description="Personal finance tracker with smart insights",
    version="1.0.0",
)

# CORS middleware — must be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(expenses.router)
app.include_router(incomes.router)
app.include_router(budgets.router)
app.include_router(analytics.router)
app.include_router(insights.router)


@app.get("/api/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy", "app": "Datafle", "version": "1.0.0"}
