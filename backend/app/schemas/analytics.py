"""Pydantic schemas for analytics and derived finance responses."""

from datetime import date

from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_this_month: float
    total_income_this_month: float
    net_balance_this_month: float
    total_last_month: float
    month_change_percent: float
    total_transactions: int
    avg_per_transaction: float
    top_category_id: int | None
    highest_expense: float
    total_budget_this_month: float
    budget_remaining: float
    budget_usage_percent: float
    over_budget_categories_count: int


class MonthlyTotalResponse(BaseModel):
    month: str
    total: float


class CashflowPointResponse(BaseModel):
    month: str
    income: float
    expenses: float
    net: float


class CategoryDistributionResponse(BaseModel):
    category_id: int
    amount: float
    percentage: float


class DailyTrendResponse(BaseModel):
    date: str
    total: float


class BudgetOverviewItemResponse(BaseModel):
    budget_id: int
    category_id: int
    category_name: str
    category_color: str
    amount: float
    spent: float
    remaining: float
    usage_percent: float
    is_over_budget: bool
    month_start: str
    note: str | None = None


class PredictionResponse(BaseModel):
    prediction: float | None
    confidence: str
    r_squared: float | None = None
    trend: str | None = None
    slope: float | None = None
    data_points: int
    message: str


class CategoryPredictionResponse(BaseModel):
    category_id: int
    prediction: float
    confidence: str


class ExchangeRatesResponse(BaseModel):
    base: str
    rates: dict[str, float]
    cached: bool


class InsightResponse(BaseModel):
    mode: str
    provider: str
    insight: str


class ErrorDetailItem(BaseModel):
    field: str
    message: str


class ErrorResponse(BaseModel):
    detail: str
    errors: list[ErrorDetailItem] | None = None


class HealthResponse(BaseModel):
    status: str
    app: str
    version: str
