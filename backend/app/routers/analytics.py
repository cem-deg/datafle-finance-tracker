"""Analytics API endpoints powered by Pandas."""

from datetime import date

from fastapi import APIRouter, Query

from app.analysis.aggregator import Aggregator
from app.analysis.predictor import Predictor
from app.routers.deps import CurrentUser, DbSession
from app.schemas.analytics import (
    BudgetOverviewItemResponse,
    CashflowPointResponse,
    CategoryDistributionResponse,
    CategoryPredictionResponse,
    DailyTrendResponse,
    DashboardSummaryResponse,
    ExchangeRatesResponse,
    MonthlyTotalResponse,
    PredictionResponse,
)
from app.services.exchange_service import exchange_service

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/summary", response_model=DashboardSummaryResponse)
def get_summary(
    db: DbSession,
    current_user: CurrentUser,
):
    """Dashboard summary with key financial metrics."""
    return Aggregator.summary(db, current_user.id)


@router.get("/monthly", response_model=list[MonthlyTotalResponse])
def monthly_totals(
    db: DbSession,
    current_user: CurrentUser,
    months: int = Query(12, ge=1, le=24),
):
    """Monthly spending totals for chart display."""
    return Aggregator.monthly_totals(db, current_user.id, months)


@router.get("/cashflow", response_model=list[CashflowPointResponse])
def monthly_cashflow(
    db: DbSession,
    current_user: CurrentUser,
    months: int = Query(12, ge=1, le=24),
):
    """Monthly income, expense, and net totals."""
    return Aggregator.monthly_cashflow(db, current_user.id, months)


@router.get(
    "/category-distribution",
    response_model=list[CategoryDistributionResponse],
)
def category_distribution(
    db: DbSession,
    current_user: CurrentUser,
    start_date: date | None = None,
    end_date: date | None = None,
):
    """Category spending distribution for pie chart."""
    return Aggregator.category_distribution(db, current_user.id, start_date, end_date)


@router.get("/trends", response_model=list[DailyTrendResponse])
def spending_trends(
    db: DbSession,
    current_user: CurrentUser,
    days: int = Query(30, ge=7, le=365),
):
    """Daily spending trend for line chart."""
    return Aggregator.daily_trend(db, current_user.id, days)


@router.get("/budgets/current", response_model=list[BudgetOverviewItemResponse])
def current_budget_overview(
    db: DbSession,
    current_user: CurrentUser,
    month_start: date | None = None,
):
    """Budget usage overview for the selected month."""
    return Aggregator.budget_overview(db, current_user.id, month_start)


@router.get("/prediction", response_model=PredictionResponse)
def get_prediction(
    db: DbSession,
    current_user: CurrentUser,
):
    """ML-based next month spending prediction."""
    return Predictor.predict_next_month(db, current_user.id)


@router.get("/prediction/categories", response_model=list[CategoryPredictionResponse])
def get_category_predictions(
    db: DbSession,
    current_user: CurrentUser,
):
    """ML-based per-category spending predictions."""
    return Predictor.predict_by_category(db, current_user.id)


@router.get("/exchange-rates", response_model=ExchangeRatesResponse)
def get_exchange_rates(base_currency: str = Query("USD", pattern="^[A-Za-z]{3}$")):
    """Get current exchange rates relative to base currency."""
    normalized_base = base_currency.upper()
    rates = exchange_service.get_rates(normalized_base)
    return ExchangeRatesResponse(
        base=normalized_base,
        rates=rates,
        cached=normalized_base in exchange_service._cache_time,
    )
