from datetime import date

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.services.exchange_service import exchange_service
from app.services.service_utils import (
    normalize_currency_code,
    normalize_email,
    normalize_optional_text,
    validate_amount_range,
    validate_date_range,
)


def register_user(
    client: TestClient,
    email: str = "baseline@example.com",
    name: str = "Baseline User",
    password: str = "secret123",
):
    response = client.post(
        "/api/auth/register",
        json={"email": email, "name": name, "password": password},
    )
    assert response.status_code == 200
    return response.json()


def auth_headers(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_protected_endpoints_require_valid_authentication(client: TestClient):
    unauthenticated = client.get("/api/expenses/")
    assert unauthenticated.status_code == 401

    malformed = client.get(
        "/api/expenses/",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert malformed.status_code == 401
    assert malformed.json()["detail"] == "Could not validate credentials"


def test_expense_validation_errors_use_stable_error_contract(client: TestClient):
    payload = register_user(client, email="validation@example.com")
    token = payload["access_token"]
    categories = client.get("/api/categories/", headers=auth_headers(token)).json()

    response = client.post(
        "/api/expenses/",
        headers=auth_headers(token),
        json={
            "amount": -5,
            "description": " ",
            "category_id": categories[0]["id"],
            "expense_date": "2026-04-07",
            "currency_code": "bad",
        },
    )

    assert response.status_code == 422
    body = response.json()
    assert isinstance(body["detail"], str)
    assert isinstance(body["errors"], list)
    error_fields = {item["field"] for item in body["errors"]}
    assert "amount" in error_fields
    assert "description" in error_fields
    assert "currency_code" in error_fields


def test_register_validation_returns_field_level_errors(client: TestClient):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "not-an-email",
            "name": " ",
            "password": "short",
        },
    )

    assert response.status_code == 422
    body = response.json()
    fields = {item["field"] for item in body["errors"]}
    assert "email" in fields
    assert "name" in fields or "password" in fields


def test_expense_list_supports_sorting_filters_and_pagination(client: TestClient):
    payload = register_user(client, email="lists@example.com")
    token = payload["access_token"]
    category_id = client.get("/api/categories/", headers=auth_headers(token)).json()[0]["id"]

    for amount, expense_date in [
        (30.0, "2026-04-01"),
        (10.0, "2026-04-02"),
        (20.0, "2026-04-03"),
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

    page_one = client.get(
        "/api/expenses/?sort_by=amount&sort_order=asc&page=1&per_page=2&min_amount=10&max_amount=25",
        headers=auth_headers(token),
    )
    assert page_one.status_code == 200
    payload_one = page_one.json()
    assert payload_one["total"] == 2
    assert payload_one["total_pages"] == 1
    assert [item["amount"] for item in payload_one["items"]] == [10.0, 20.0]


def test_cashflow_and_trends_normalize_mixed_currency_amounts(client: TestClient):
    payload = register_user(client, email="cashflow@example.com")
    token = payload["access_token"]
    category_id = client.get("/api/categories/", headers=auth_headers(token)).json()[0]["id"]

    expense_response = client.post(
        "/api/expenses/",
        headers=auth_headers(token),
        json={
            "amount": 92.0,
            "description": "EUR groceries",
            "category_id": category_id,
            "expense_date": "2026-04-02",
            "currency_code": "EUR",
        },
    )
    assert expense_response.status_code == 201

    income_response = client.post(
        "/api/incomes/",
        headers=auth_headers(token),
        json={
            "amount": 184.0,
            "description": "EUR freelance",
            "income_date": "2026-04-01",
            "source": "Freelance",
            "currency_code": "EUR",
        },
    )
    assert income_response.status_code == 201

    cashflow_response = client.get(
        "/api/analytics/cashflow?months=1",
        headers=auth_headers(token),
    )
    assert cashflow_response.status_code == 200
    cashflow = cashflow_response.json()[0]
    assert cashflow["expenses"] == 100.0
    assert cashflow["income"] == 200.0
    assert cashflow["net"] == 100.0

    trends_response = client.get(
        "/api/analytics/trends?days=30",
        headers=auth_headers(token),
    )
    assert trends_response.status_code == 200
    trend_point = next(
        item for item in trends_response.json() if item["date"] == "2026-04-02"
    )
    assert trend_point["total"] == 100.0


def test_service_utils_normalize_and_validate_inputs():
    assert normalize_email("  User@Example.com  ") == "user@example.com"
    assert normalize_currency_code(" eur ") == "EUR"
    assert normalize_optional_text("  note  ") == "note"
    assert normalize_optional_text("   ") is None

    with pytest.raises(HTTPException) as date_error:
        validate_date_range(date(2026, 4, 7), date(2026, 4, 1))
    assert date_error.value.detail == "start_date cannot be after end_date"

    with pytest.raises(HTTPException) as amount_error:
        validate_amount_range(50, 10)
    assert amount_error.value.detail == "min_amount cannot be greater than max_amount"


def test_exchange_service_uses_fallback_rates_for_core_conversions():
    assert exchange_service.convert(100, "USD", "USD") == 100
    assert exchange_service.normalize_to_base(None, "USD") == 0.0

    eur_to_usd = exchange_service.normalize_to_base(92.0, "EUR")
    usd_to_eur = exchange_service.convert(100.0, "USD", "EUR")

    assert round(eur_to_usd, 2) == 100.0
    assert round(usd_to_eur, 2) == 92.0
