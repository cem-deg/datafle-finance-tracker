from fastapi.testclient import TestClient


def register_user(
    client: TestClient,
    email: str = "user@example.com",
    name: str = "Test User",
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


def test_register_seeds_default_categories(client: TestClient):
    payload = register_user(client)

    categories_response = client.get(
        "/api/categories/",
        headers=auth_headers(payload["access_token"]),
    )

    assert categories_response.status_code == 200
    categories = categories_response.json()
    assert len(categories) == 8
    assert any(category["name"] == "Food & Dining" for category in categories)


def test_expense_requires_owned_category(client: TestClient):
    owner = register_user(client, email="owner@example.com")
    attacker = register_user(client, email="attacker@example.com")

    owner_categories = client.get(
        "/api/categories/",
        headers=auth_headers(owner["access_token"]),
    ).json()
    foreign_category_id = owner_categories[0]["id"]

    response = client.post(
        "/api/expenses/",
        headers=auth_headers(attacker["access_token"]),
        json={
            "amount": 55.5,
            "description": "Should fail",
            "category_id": foreign_category_id,
            "expense_date": "2026-04-05",
            "currency_code": "USD",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid category for this user"


def test_expense_crud_flow(client: TestClient):
    payload = register_user(client, email="crud@example.com")
    token = payload["access_token"]
    categories = client.get(
        "/api/categories/",
        headers=auth_headers(token),
    ).json()
    category_id = categories[0]["id"]

    create_response = client.post(
        "/api/expenses/",
        headers=auth_headers(token),
        json={
            "amount": 120.0,
            "description": "Groceries",
            "category_id": category_id,
            "expense_date": "2026-04-01",
            "currency_code": "USD",
        },
    )
    assert create_response.status_code == 201
    expense = create_response.json()
    assert expense["currency_code"] == "USD"

    update_response = client.put(
        f"/api/expenses/{expense['id']}",
        headers=auth_headers(token),
        json={"amount": 140.0},
    )
    assert update_response.status_code == 200
    assert update_response.json()["amount"] == 140.0

    list_response = client.get(
        "/api/expenses/",
        headers=auth_headers(token),
    )
    assert list_response.status_code == 200
    assert list_response.json()["total"] == 1


def test_income_and_budget_crud_flow(client: TestClient):
    payload = register_user(client, email="finance@example.com")
    token = payload["access_token"]
    categories = client.get(
        "/api/categories/",
        headers=auth_headers(token),
    ).json()
    category_id = categories[0]["id"]

    income_response = client.post(
        "/api/incomes/",
        headers=auth_headers(token),
        json={
            "amount": 2200.0,
            "description": "April salary",
            "income_date": "2026-04-01",
            "source": "Salary",
            "currency_code": "USD",
        },
    )
    assert income_response.status_code == 201
    income = income_response.json()

    budget_response = client.post(
        "/api/budgets/",
        headers=auth_headers(token),
        json={
            "amount": 500.0,
            "category_id": category_id,
            "month_start": "2026-04-01",
            "note": "Groceries target",
        },
    )
    assert budget_response.status_code == 201
    budget = budget_response.json()
    assert budget["category_id"] == category_id

    update_income = client.put(
        f"/api/incomes/{income['id']}",
        headers=auth_headers(token),
        json={"amount": 2300.0},
    )
    assert update_income.status_code == 200
    assert update_income.json()["amount"] == 2300.0

    budget_list = client.get(
        "/api/budgets/?month_start=2026-04-01",
        headers=auth_headers(token),
    )
    assert budget_list.status_code == 200
    assert len(budget_list.json()) == 1
