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


def test_auth_normalizes_email_for_login_and_duplicates(client: TestClient):
    register_user(client, email="Casey@Example.com")

    duplicate_response = client.post(
        "/api/auth/register",
        json={
            "email": "casey@example.com",
            "name": "Duplicate User",
            "password": "secret123",
        },
    )
    assert duplicate_response.status_code == 400
    assert duplicate_response.json()["detail"] == "Email already registered"

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "CASEY@EXAMPLE.COM",
            "password": "secret123",
        },
    )
    assert login_response.status_code == 200


def test_category_name_must_be_unique_per_user(client: TestClient):
    payload = register_user(client, email="categories@example.com")
    token = payload["access_token"]

    first_response = client.post(
        "/api/categories/",
        headers=auth_headers(token),
        json={"name": "groceries", "icon": "circle", "color": "#6c5ce7"},
    )
    assert first_response.status_code == 201

    response = client.post(
        "/api/categories/",
        headers=auth_headers(token),
        json={"name": "Groceries", "icon": "circle", "color": "#6c5ce7"},
    )

    assert response.status_code == 409
    assert response.json()["detail"] == "Category name already exists"


def test_budget_create_rejects_duplicate_month_and_category(client: TestClient):
    payload = register_user(client, email="budget-dup@example.com")
    token = payload["access_token"]
    categories = client.get(
        "/api/categories/",
        headers=auth_headers(token),
    ).json()
    category_id = categories[0]["id"]

    first_response = client.post(
        "/api/budgets/",
        headers=auth_headers(token),
        json={
            "amount": 300.0,
            "category_id": category_id,
            "month_start": "2026-04-01",
            "currency_code": "USD",
        },
    )
    assert first_response.status_code == 201

    duplicate_response = client.post(
        "/api/budgets/",
        headers=auth_headers(token),
        json={
            "amount": 325.0,
            "category_id": category_id,
            "month_start": "2026-04-15",
            "currency_code": "USD",
        },
    )

    assert duplicate_response.status_code == 409
    assert (
        duplicate_response.json()["detail"]
        == "A budget already exists for this category and month"
    )


def test_list_endpoints_reject_invalid_ranges(client: TestClient):
    payload = register_user(client, email="ranges@example.com")
    token = payload["access_token"]
    headers = auth_headers(token)

    expense_response = client.get(
        "/api/expenses/?start_date=2026-04-10&end_date=2026-04-01",
        headers=headers,
    )
    assert expense_response.status_code == 400
    assert expense_response.json()["detail"] == "start_date cannot be after end_date"

    income_response = client.get(
        "/api/incomes/?min_amount=500&max_amount=100",
        headers=headers,
    )
    assert income_response.status_code == 400
    assert income_response.json()["detail"] == "min_amount cannot be greater than max_amount"


def test_invalid_currency_code_is_rejected(client: TestClient):
    payload = register_user(client, email="currency@example.com")
    token = payload["access_token"]
    categories = client.get(
        "/api/categories/",
        headers=auth_headers(token),
    ).json()

    response = client.post(
        "/api/expenses/",
        headers=auth_headers(token),
        json={
            "amount": 15,
            "description": "Coffee",
            "category_id": categories[0]["id"],
            "expense_date": "2026-04-07",
            "currency_code": "XYZ",
        },
    )

    assert response.status_code == 422
    body = response.json()
    assert body["detail"] == "Value error, Unsupported currency code"
    assert body["errors"][0]["field"] == "currency_code"


def test_users_cannot_access_other_users_income_or_budget(client: TestClient):
    owner = register_user(client, email="owner2@example.com")
    attacker = register_user(client, email="attacker2@example.com")

    owner_categories = client.get(
        "/api/categories/",
        headers=auth_headers(owner["access_token"]),
    ).json()
    category_id = owner_categories[0]["id"]

    income_response = client.post(
        "/api/incomes/",
        headers=auth_headers(owner["access_token"]),
        json={
            "amount": 1500.0,
            "description": "Owner salary",
            "income_date": "2026-04-01",
            "source": "Salary",
            "currency_code": "USD",
        },
    )
    assert income_response.status_code == 201
    income_id = income_response.json()["id"]

    budget_response = client.post(
        "/api/budgets/",
        headers=auth_headers(owner["access_token"]),
        json={
            "amount": 400.0,
            "category_id": category_id,
            "month_start": "2026-04-01",
            "currency_code": "USD",
        },
    )
    assert budget_response.status_code == 201
    budget_id = budget_response.json()["id"]

    attacker_income_get = client.get(
        f"/api/incomes/{income_id}",
        headers=auth_headers(attacker["access_token"]),
    )
    assert attacker_income_get.status_code == 404

    attacker_income_delete = client.delete(
        f"/api/incomes/{income_id}",
        headers=auth_headers(attacker["access_token"]),
    )
    assert attacker_income_delete.status_code == 404

    attacker_budget_update = client.put(
        f"/api/budgets/{budget_id}",
        headers=auth_headers(attacker["access_token"]),
        json={"amount": 999.0},
    )
    assert attacker_budget_update.status_code == 404

    attacker_budget_delete = client.delete(
        f"/api/budgets/{budget_id}",
        headers=auth_headers(attacker["access_token"]),
    )
    assert attacker_budget_delete.status_code == 404
