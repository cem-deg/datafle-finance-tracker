"""Pydantic schema exports."""

from app.schemas.analytics import (
    BudgetOverviewItemResponse,
    CashflowPointResponse,
    CategoryDistributionResponse,
    CategoryPredictionResponse,
    DailyTrendResponse,
    DashboardSummaryResponse,
    ErrorDetailItem,
    ErrorResponse,
    ExchangeRatesResponse,
    HealthResponse,
    InsightResponse,
    MonthlyTotalResponse,
    PredictionResponse,
)
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetUpdate
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseListResponse,
    ExpenseResponse,
    ExpenseUpdate,
)
from app.schemas.income import (
    IncomeCreate,
    IncomeListResponse,
    IncomeResponse,
    IncomeUpdate,
)
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse

__all__ = [
    "BudgetCreate",
    "BudgetOverviewItemResponse",
    "BudgetResponse",
    "BudgetUpdate",
    "CashflowPointResponse",
    "CategoryCreate",
    "CategoryDistributionResponse",
    "CategoryPredictionResponse",
    "CategoryResponse",
    "CategoryUpdate",
    "DailyTrendResponse",
    "DashboardSummaryResponse",
    "ErrorDetailItem",
    "ErrorResponse",
    "ExchangeRatesResponse",
    "ExpenseCreate",
    "ExpenseListResponse",
    "ExpenseResponse",
    "ExpenseUpdate",
    "HealthResponse",
    "IncomeCreate",
    "IncomeListResponse",
    "IncomeResponse",
    "IncomeUpdate",
    "InsightResponse",
    "MonthlyTotalResponse",
    "PredictionResponse",
    "Token",
    "UserCreate",
    "UserLogin",
    "UserResponse",
]
