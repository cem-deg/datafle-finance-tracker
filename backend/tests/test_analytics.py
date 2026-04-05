from datetime import date

from fastapi.testclient import TestClient

from app.analysis.aggregator import Aggregator


def register_user(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "analytics@example.com",
            "name": "Analytics User",
            "password": "secret123",
        },
    )
    assert response.status_code == 200
    return response.json()


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_month_shift_is_calendar_accurate():
    shifted = Aggregator._shift_month(date(2026, 4, 5), 5)
    assert shifted == date(2025, 11, 1)


def test_summary_endpoint_returns_expected_metrics(client: TestClient):
    payload = register_user(client)
    token = payload["access_token"]
    categories = client.get(
        "/api/categories/",
        headers=auth_headers(token),
    ).json()
    category_id = categories[0]["id"]

    for amount, expense_date in [
        (100.0, "2026-04-01"),
        (50.0, "2026-04-02"),
        (80.0, "2026-03-15"),
    ]:
        response = client.post(
            "/api/expenses/",
            headers=auth_headers(token),
            json={
                "amount": amount,
                "description": f"Expense {amount}",
                "category_id": category_id,
                "expense_date": expense_date,
                "currency_code": "USD",
            },
        )
        assert response.status_code == 201

    summary_response = client.get(
        "/api/analytics/summary",
        headers=auth_headers(token),
    )
    assert summary_response.status_code == 200

    summary = summary_response.json()
    assert summary["total_this_month"] == 150.0
    assert summary["total_last_month"] == 80.0
    assert summary["total_transactions"] == 2
    assert summary["top_category_id"] == category_id


def test_summary_includes_income_and_budget_metrics(client: TestClient):
    payload = register_user(client)
    token = payload["access_token"]
    categories = client.get(
        "/api/categories/",
        headers=auth_headers(token),
    ).json()
    category_id = categories[0]["id"]

    create_income = client.post(
        "/api/incomes/",
        headers=auth_headers(token),
        json={
            "amount": 3000.0,
            "description": "Salary",
            "income_date": "2026-04-01",
            "source": "Salary",
            "currency_code": "USD",
        },
    )
    assert create_income.status_code == 201

    create_expense = client.post(
        "/api/expenses/",
        headers=auth_headers(token),
        json={
            "amount": 450.0,
            "description": "Groceries",
            "category_id": category_id,
            "expense_date": "2026-04-02",
            "currency_code": "USD",
        },
    )
    assert create_expense.status_code == 201

    create_budget = client.post(
        "/api/budgets/",
        headers=auth_headers(token),
        json={
            "amount": 500.0,
            "category_id": category_id,
            "month_start": "2026-04-01",
            "note": "Essentials",
        },
    )
    assert create_budget.status_code == 201

    summary_response = client.get(
        "/api/analytics/summary",
        headers=auth_headers(token),
    )
    assert summary_response.status_code == 200
    summary = summary_response.json()

    assert summary["total_income_this_month"] == 3000.0
    assert summary["net_balance_this_month"] == 2550.0
    assert summary["total_budget_this_month"] == 500.0
    assert summary["budget_remaining"] == 50.0
    assert summary["budget_usage_percent"] == 90.0

    budget_overview_response = client.get(
        "/api/analytics/budgets/current?month_start=2026-04-01",
        headers=auth_headers(token),
    )
    assert budget_overview_response.status_code == 200
    overview = budget_overview_response.json()
    assert len(overview) == 1
    assert overview[0]["spent"] == 450.0
