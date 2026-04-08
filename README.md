# Datafle

Datafle is a full-stack personal finance tracker built as a portfolio project. It helps users record income and expenses, manage monthly category budgets, review trends, and generate rule-based or AI-assisted insights from their financial activity.

The project is designed to feel practical rather than theoretical: it includes authentication, typed frontend/backend contracts, validation, analytics, multi-currency support, and a tested backend API.

## What The Project Does

Datafle lets a user:

- create an account and sign in
- manage personal categories
- track expenses with dates, categories, and currencies
- track income from different sources
- set monthly budgets per category
- monitor dashboard summaries such as spending, income, and budget usage
- review analytics like monthly totals, cashflow, trends, and category distribution
- generate smart insights using either a local rule-based engine or an optional Gemini-backed AI provider

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Recharts
- Lucide React

### Backend

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT authentication

### Data / Runtime

- SQLite for quick local development
- PostgreSQL-ready via SQLAlchemy + Alembic
- Optional external APIs:
  - Gemini API for AI insights
  - Exchange rate API for live currency rates

## Project Structure

```text
finance-tracker/
├─ frontend/              # Next.js app
│  └─ src/
│     ├─ app/             # Pages
│     ├─ components/      # Shared UI and charts
│     ├─ context/         # Auth, theme, currency
│     ├─ hooks/           # Data and UI hooks
│     ├─ services/        # API client
│     ├─ types/           # Shared frontend types
│     └─ utils/           # Formatting and helper utilities
├─ backend/               # FastAPI app
│  ├─ app/
│  │  ├─ ai/             # Rule-based and AI insight providers
│  │  ├─ analysis/       # Analytics and prediction logic
│  │  ├─ models/         # SQLAlchemy models
│  │  ├─ routers/        # API routes
│  │  ├─ schemas/        # Pydantic schemas
│  │  └─ services/       # Business logic and shared helpers
│  ├─ alembic/           # Database migrations
│  └─ tests/             # Backend test suite
└─ README.md
```

## Main Features

### Authentication

- Users register with email, name, and password.
- The backend issues a JWT access token.
- The frontend stores the token in `localStorage` and attaches it to API requests as a bearer token.
- Protected backend routes resolve the current user from the token and scope queries to that user.

### Income And Expense Tracking

- Expenses belong to the signed-in user and require an owned category.
- Income entries include amount, source, date, and currency.
- List endpoints support filtering, sorting, and pagination.

### Budgeting

- Budgets are defined per category and month.
- Budget overview compares budget limits to spending for the selected month.
- Duplicate budgets for the same user/category/month are rejected server-side.

### Analytics

- Dashboard summary
- Monthly spending totals
- Monthly cashflow
- Category distribution
- Daily trends
- Spending prediction

Analytics normalize mixed-currency data to a base currency before aggregation so totals remain consistent.

### Smart Insights

- Rule-based insights work without any external AI API.
- AI insights can be enabled by providing a Gemini API key.
- If AI is unavailable, the project still supports rule-based insights.

## Environment Variables

### Backend

Create `backend/.env`.

Minimum local example:

```env
DATABASE_URL=sqlite:///./datafle.db
SECRET_KEY=replace-this-with-a-long-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=720
GEMINI_API_KEY=
EXCHANGE_API_KEY=
AUTO_CREATE_TABLES=false
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Notes:

- `DATABASE_URL`: SQLite is fine for local development. PostgreSQL is recommended for production-style environments.
- `SECRET_KEY`: required for JWT signing. Do not use a weak or shared value outside local development.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT lifetime in minutes.
- `GEMINI_API_KEY`: optional. Enables AI-generated insights.
- `EXCHANGE_API_KEY`: optional. Enables live exchange rates. Without it, fallback rates are used.
- `AUTO_CREATE_TABLES`: should stay `false` when using Alembic migrations.
- `CORS_ORIGINS`: comma-separated frontend origins allowed to call the API.

### Frontend

Create `frontend/.env.local`.

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.11+

### 1. Backend Setup

```git bash
cd backend
py -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Backend health check:

```text
http://localhost:8000/api/health
```

Expected response:

```json
{"status":"healthy","app":"Datafle","version":"1.0.0"}
```

### 2. Frontend Setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## How To Run The Project Locally

Recommended order:

1. Start the backend.
2. Confirm `http://localhost:8000/api/health` responds successfully.
3. Start the frontend.
4. Open `http://localhost:3000`.
5. Register a new account and test the main flows.

## Authentication Flow

Current authentication behavior:

1. The user registers or logs in via `/api/auth/register` or `/api/auth/login`.
2. The backend returns an access token and user object.
3. The frontend stores the token in `localStorage`.
4. The API client sends `Authorization: Bearer <token>` on authenticated requests.
5. Backend dependencies decode the JWT, load the user, and scope DB access to that user.

Security note:

- This is acceptable for a portfolio/demo project, but `localStorage`-based bearer auth is not the strongest production setup. A future hardening step would be secure HTTP-only cookies with refresh/revocation support.

## How The Main Features Work

### Dashboard

The dashboard combines summary metrics, recent transactions, monthly totals, and budget usage. It is intended as the main overview page for a signed-in user.

### Transactions

Expenses and income are stored as user-owned records. Validation is performed server-side for required fields, supported currencies, ranges, and ownership-sensitive relationships such as category selection.

### Budgets

Budgets are stored monthly and scoped to a category. Budget usage is derived by comparing the normalized budget amount against spending in the same period.

### Currency Handling

Transactions and budgets can be stored in different currencies. Analytics normalize those values to a base currency for comparison and reporting.

### Insights

Insights are generated from the user’s summary and category patterns. Rule-based mode is always available; AI mode requires configuration and may depend on external services.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Categories

- `GET /api/categories/`
- `POST /api/categories/`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Expenses

- `GET /api/expenses/`
- `GET /api/expenses/recent`
- `GET /api/expenses/{id}`
- `POST /api/expenses/`
- `PUT /api/expenses/{id}`
- `DELETE /api/expenses/{id}`

### Incomes

- `GET /api/incomes/`
- `GET /api/incomes/recent`
- `GET /api/incomes/{id}`
- `POST /api/incomes/`
- `PUT /api/incomes/{id}`
- `DELETE /api/incomes/{id}`

### Budgets

- `GET /api/budgets/`
- `POST /api/budgets/`
- `PUT /api/budgets/{id}`
- `DELETE /api/budgets/{id}`

### Analytics

- `GET /api/analytics/summary`
- `GET /api/analytics/monthly`
- `GET /api/analytics/cashflow`
- `GET /api/analytics/category-distribution`
- `GET /api/analytics/trends`
- `GET /api/analytics/budgets/current`
- `GET /api/analytics/prediction`
- `GET /api/analytics/prediction/categories`
- `GET /api/analytics/exchange-rates`

### Insights

- `GET /api/insights/`

## Running Tests

### Backend

```powershell
cd backend
.\venv\Scripts\python.exe -m pytest
```

Current backend tests cover:

- auth-sensitive flows
- permission and ownership rules
- important validation behavior
- analytics and summary calculations
- utility and currency normalization helpers

### Frontend

The project currently uses verification checks instead of a dedicated frontend test runner:

```powershell
cd frontend
npm run lint
npm run build
```

## Known Limitations

- The frontend currently stores JWTs in `localStorage`.
- Money values still flow through parts of the application as `float` instead of `Decimal`.
- Historical currency conversion uses current/fallback exchange rates rather than true historical FX data.
- SQLite is convenient for local development, but PostgreSQL is the better long-term database target.
- The frontend does not yet have a dedicated UI test suite.
- Some analytics still use Pandas in request paths, which is acceptable for a portfolio-sized project but not ideal at larger scale.

## Suggested Future Improvements

- move auth to secure cookie-based sessions or refresh-token flows
- migrate money handling to `Decimal` end to end
- add frontend integration tests for key user flows
- add DB-level uniqueness constraints and more indexing
- move more analytics work into SQL or cached summaries
- add subscription or plan concepts if the product scope expands
- support historical exchange rates for more accurate reporting

## Portfolio Notes

This project demonstrates:

- full-stack product thinking
- typed API contracts between frontend and backend
- authentication and user-scoped data access
- validation and error handling
- analytics and derived business logic
- maintainability-focused refactoring
- performance-minded cleanup
- practical automated backend testing

## Quick Commands

### Backend

```powershell
cd backend
.\venv\Scripts\python.exe -m alembic upgrade head
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
.\venv\Scripts\python.exe -m pytest
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
npm run lint
npm run build
```
