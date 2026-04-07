"""Pandas-based data aggregation for dashboard analytics."""

from datetime import date, timedelta

import pandas as pd
from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.models.category import Category
from app.models.expense import Expense
from app.models.income import Income
from app.services.exchange_service import exchange_service


class Aggregator:
    """Aggregates raw financial data into analytics-ready structures."""

    @staticmethod
    def _shift_month(source: date, months_back: int) -> date:
        """Return the first day of the month shifted backward by N months."""
        total_months = source.year * 12 + (source.month - 1) - months_back
        year = total_months // 12
        month = total_months % 12 + 1
        return date(year, month, 1)

    @staticmethod
    def _add_amount_base(df: pd.DataFrame, amount_column: str = "amount") -> pd.DataFrame:
        """Add normalized USD amounts without row-by-row apply overhead."""
        if df.empty:
            df["amount_base"] = pd.Series(dtype="float64")
            return df

        rates = exchange_service.get_rates("USD")
        currency_codes = df["currency_code"].fillna("USD").astype(str).str.upper()
        raw_amounts = pd.to_numeric(df[amount_column])
        from_rates = currency_codes.map(rates).fillna(1.0)
        usd_amounts = raw_amounts.where(currency_codes == "USD", raw_amounts / from_rates)
        df["currency_code"] = currency_codes
        df["amount_base"] = usd_amounts.astype(float)
        return df

    @staticmethod
    def _load_expenses_df(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> pd.DataFrame:
        """Load user expenses from DB into a Pandas DataFrame."""
        query = (
            db.query(
                Expense.id,
                Expense.amount,
                Expense.description,
                Expense.expense_date,
                Expense.category_id,
                Expense.currency_code,
            )
            .filter(Expense.user_id == user_id)
        )

        if start_date:
            query = query.filter(Expense.expense_date >= start_date)
        if end_date:
            query = query.filter(Expense.expense_date <= end_date)

        expenses = query.all()

        if not expenses:
            return pd.DataFrame(
                columns=[
                    "id",
                    "amount",
                    "description",
                    "expense_date",
                    "category_id",
                    "currency_code",
                    "amount_base",
                ]
            )

        df = pd.DataFrame(
            expenses,
            columns=[
                "id",
                "amount",
                "description",
                "expense_date",
                "category_id",
                "currency_code",
            ],
        )
        df["expense_date"] = pd.to_datetime(df["expense_date"])
        return Aggregator._add_amount_base(df)

    @staticmethod
    def _load_incomes_df(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> pd.DataFrame:
        """Load user incomes from DB into a Pandas DataFrame."""
        query = (
            db.query(
                Income.id,
                Income.amount,
                Income.description,
                Income.income_date,
                Income.source,
                Income.currency_code,
            )
            .filter(Income.user_id == user_id)
        )

        if start_date:
            query = query.filter(Income.income_date >= start_date)
        if end_date:
            query = query.filter(Income.income_date <= end_date)

        incomes = query.all()

        if not incomes:
            return pd.DataFrame(
                columns=[
                    "id",
                    "amount",
                    "description",
                    "income_date",
                    "source",
                    "currency_code",
                    "amount_base",
                ]
            )

        df = pd.DataFrame(
            incomes,
            columns=[
                "id",
                "amount",
                "description",
                "income_date",
                "source",
                "currency_code",
            ],
        )
        df["income_date"] = pd.to_datetime(df["income_date"])
        return Aggregator._add_amount_base(df)

    @staticmethod
    def monthly_totals(db: Session, user_id: int, months: int = 12) -> list[dict]:
        """Calculate total spending per month for the last N months."""
        today = date.today()
        start_month = Aggregator._shift_month(today, months - 1)
        df = Aggregator._load_expenses_df(db, user_id, start_date=start_month)
        if df.empty:
            return []

        df["month_str"] = df["expense_date"].dt.strftime("%Y-%m")
        grouped = df.groupby("month_str")["amount_base"].sum().to_dict()

        result = []
        for i in range(months - 1, -1, -1):
            d = Aggregator._shift_month(today, i)
            month_key = d.strftime("%Y-%m")
            result.append(
                {
                    "month": month_key,
                    "total": round(float(grouped.get(month_key, 0)), 2),
                }
            )

        return result

    @staticmethod
    def monthly_cashflow(db: Session, user_id: int, months: int = 12) -> list[dict]:
        """Calculate monthly income, expenses, and net flow."""
        today = date.today()
        start_month = Aggregator._shift_month(today, months - 1)
        expenses_df = Aggregator._load_expenses_df(db, user_id, start_date=start_month)
        incomes_df = Aggregator._load_incomes_df(db, user_id, start_date=start_month)

        expense_grouped: dict[str, float] = {}
        income_grouped: dict[str, float] = {}

        if not expenses_df.empty:
            expenses_df["month_str"] = expenses_df["expense_date"].dt.strftime("%Y-%m")
            expense_grouped = expenses_df.groupby("month_str")["amount_base"].sum().to_dict()

        if not incomes_df.empty:
            incomes_df["month_str"] = incomes_df["income_date"].dt.strftime("%Y-%m")
            income_grouped = incomes_df.groupby("month_str")["amount_base"].sum().to_dict()

        result = []
        for i in range(months - 1, -1, -1):
            d = Aggregator._shift_month(today, i)
            month_key = d.strftime("%Y-%m")
            income = round(float(income_grouped.get(month_key, 0)), 2)
            expenses = round(float(expense_grouped.get(month_key, 0)), 2)
            result.append(
                {
                    "month": month_key,
                    "income": income,
                    "expenses": expenses,
                    "net": round(income - expenses, 2),
                }
            )

        return result

    @staticmethod
    def category_distribution(
        db: Session,
        user_id: int,
        start_date: date | None = None,
        end_date: date | None = None,
    ) -> list[dict]:
        """Calculate spending distribution across categories."""
        df = Aggregator._load_expenses_df(db, user_id, start_date=start_date, end_date=end_date)
        if df.empty:
            return []

        grouped = df.groupby("category_id")["amount_base"].sum().reset_index()
        grouped = grouped.rename(columns={"amount_base": "amount"})
        total = grouped["amount"].sum()
        grouped["percentage"] = (grouped["amount"] / total * 100).round(1)
        return grouped.to_dict("records")

    @staticmethod
    def daily_trend(db: Session, user_id: int, days: int = 30) -> list[dict]:
        """Calculate daily spending trend for the last N days."""
        today = date.today()
        start_date = today - timedelta(days=days - 1)
        df = Aggregator._load_expenses_df(db, user_id, start_date=start_date)
        if df.empty:
            return []

        df["date_str"] = df["expense_date"].dt.strftime("%Y-%m-%d")
        grouped = df.groupby("date_str")["amount_base"].sum().to_dict()

        result = []
        for i in range(days - 1, -1, -1):
            d = today - timedelta(days=i)
            key = d.strftime("%Y-%m-%d")
            result.append(
                {
                    "date": key,
                    "total": round(float(grouped.get(key, 0)), 2),
                }
            )
        return result

    @staticmethod
    def summary(db: Session, user_id: int) -> dict:
        """Generate a dashboard summary with income, expense, and budget metrics."""
        today = date.today()
        this_month_start = today.replace(day=1)
        next_month_start = Aggregator._shift_month(today, -1)
        last_month_end = this_month_start - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)
        expense_df = Aggregator._load_expenses_df(
            db,
            user_id,
            start_date=last_month_start,
            end_date=next_month_start - timedelta(days=1),
        )
        income_df = Aggregator._load_incomes_df(
            db,
            user_id,
            start_date=this_month_start,
            end_date=next_month_start - timedelta(days=1),
        )

        if expense_df.empty and income_df.empty:
            return {
                "total_this_month": 0,
                "total_income_this_month": 0,
                "net_balance_this_month": 0,
                "total_last_month": 0,
                "month_change_percent": 0,
                "total_transactions": 0,
                "avg_per_transaction": 0,
                "top_category_id": None,
                "highest_expense": 0,
                "total_budget_this_month": 0,
                "budget_remaining": 0,
                "budget_usage_percent": 0,
                "over_budget_categories_count": 0,
            }

        this_month_expenses = (
            expense_df[expense_df["expense_date"] >= pd.Timestamp(this_month_start)]
            if not expense_df.empty
            else expense_df
        )
        last_month_expenses = (
            expense_df[
                (expense_df["expense_date"] >= pd.Timestamp(last_month_start))
                & (expense_df["expense_date"] <= pd.Timestamp(last_month_end))
            ]
            if not expense_df.empty
            else expense_df
        )
        this_month_incomes = (
            income_df[
                (income_df["income_date"] >= pd.Timestamp(this_month_start))
                & (income_df["income_date"] < pd.Timestamp(next_month_start))
            ]
            if not income_df.empty
            else income_df
        )

        total_this = float(this_month_expenses["amount_base"].sum()) if not this_month_expenses.empty else 0
        total_last = float(last_month_expenses["amount_base"].sum()) if not last_month_expenses.empty else 0
        total_income_this = float(this_month_incomes["amount_base"].sum()) if not this_month_incomes.empty else 0

        budgets = (
            db.query(Budget)
            .filter(Budget.user_id == user_id, Budget.month_start == this_month_start)
            .all()
        )
        total_budget = round(
            sum(
                exchange_service.normalize_to_base(
                    float(budget.amount), budget.currency_code
                )
                for budget in budgets
            ),
            2,
        )
        category_spend = (
            this_month_expenses.groupby("category_id")["amount_base"].sum().to_dict()
            if not this_month_expenses.empty
            else {}
        )
        over_budget_count = sum(
            1
            for budget in budgets
            if category_spend.get(budget.category_id, 0)
            > exchange_service.normalize_to_base(float(budget.amount), budget.currency_code)
        )

        if total_last > 0:
            change = round((total_this - total_last) / total_last * 100, 1)
        else:
            change = 100.0 if total_this > 0 else 0.0

        top_cat = None
        if not this_month_expenses.empty:
            top_cat = int(
                this_month_expenses.groupby("category_id")["amount_base"].sum().idxmax()
            )

        return {
            "total_this_month": round(total_this, 2),
            "total_income_this_month": round(total_income_this, 2),
            "net_balance_this_month": round(total_income_this - total_this, 2),
            "total_last_month": round(total_last, 2),
            "month_change_percent": change,
            "total_transactions": len(this_month_expenses),
            "avg_per_transaction": round(total_this / len(this_month_expenses), 2)
            if len(this_month_expenses) > 0
            else 0,
            "top_category_id": top_cat,
            "highest_expense": round(float(this_month_expenses["amount_base"].max()), 2)
            if not this_month_expenses.empty
            else 0,
            "total_budget_this_month": total_budget,
            "budget_remaining": round(total_budget - total_this, 2),
            "budget_usage_percent": round((total_this / total_budget) * 100, 1)
            if total_budget > 0
            else 0,
            "over_budget_categories_count": over_budget_count,
        }

    @staticmethod
    def budget_overview(
        db: Session, user_id: int, month_start: date | None = None
    ) -> list[dict]:
        """Return per-category budget performance for the selected month."""
        target_month = (month_start or date.today()).replace(day=1)
        next_month = Aggregator._shift_month(target_month, -1)

        budgets = (
            db.query(Budget)
            .join(Category, Category.id == Budget.category_id)
            .filter(Budget.user_id == user_id, Budget.month_start == target_month)
            .all()
        )
        if not budgets:
            return []

        expense_df = Aggregator._load_expenses_df(
            db,
            user_id,
            start_date=target_month,
            end_date=next_month - timedelta(days=1),
        )
        category_spend: dict[int, float] = {}
        if not expense_df.empty:
            category_spend = expense_df.groupby("category_id")["amount_base"].sum().to_dict()

        result = []
        for budget in budgets:
            spent = round(float(category_spend.get(budget.category_id, 0)), 2)
            limit_amount = round(
                exchange_service.normalize_to_base(
                    float(budget.amount), budget.currency_code
                ),
                2,
            )
            remaining = round(limit_amount - spent, 2)
            usage_percent = round((spent / limit_amount) * 100, 1) if limit_amount > 0 else 0
            result.append(
                {
                    "budget_id": budget.id,
                    "category_id": budget.category_id,
                    "category_name": budget.category.name,
                    "category_color": budget.category.color,
                    "amount": limit_amount,
                    "spent": spent,
                    "remaining": remaining,
                    "usage_percent": usage_percent,
                    "is_over_budget": spent > limit_amount,
                    "month_start": target_month.isoformat(),
                    "note": budget.note,
                }
            )

        return sorted(result, key=lambda item: item["usage_percent"], reverse=True)
