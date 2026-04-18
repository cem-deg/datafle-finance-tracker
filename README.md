# Finance Tracker
---

## Short Description

Finance Tracker is a full-stack personal finance application that helps users track income, expenses, budgets, and financial trends in a single interface.

The project focuses on building a practical system with real-world features, while also maintaining a clean and scalable frontend architecture.

---

## Features

* Track income and expenses with categories and dates
* Create and manage monthly category budgets
* Dashboard overview (spending, income, budget usage)
* Analytics:
  * monthly totals
  * cashflow
  * category distribution
  * trends and predictions

* Multi-currency support with normalization
* Smart insights (rule-based + optional AI)
* Authentication (JWT-based)
* Responsive UI (desktop + mobile)

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Recharts
* Tailwind CSS + CSS Modules

### Backend

* FastAPI
* SQLAlchemy
* Alembic
* Pydantic
* JWT Authentication

### Data / Runtime

* SQLite (local development)
* PostgreSQL-ready
* Optional APIs:

  * Gemini API (AI insights)
  * Exchange rate API

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/finance-tracker.git
cd finance-tracker
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

Check:

```
http://localhost:8000/api/health
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Project Notes

Focus areas:

* real user flows (auth, CRUD, analytics)
* consistent data modeling across frontend and backend
* clean UI with a structured styling system
* maintainability over quick feature additions

Some intentional decisions:

* yearly and mixed-currency data are normalized for consistent analytics
* insights work without AI, but can optionally use external providers
* backend validation enforces ownership and data integrity
* frontend prioritizes clarity and predictable layout

---

## UI / Architecture Highlights

* Token-based styling system
* Component-level CSS ownership (CSS Modules)
* Reduced global CSS usage
* Unified visual system across:

  * Landing
  * Dashboard
  * Auth

---

## Authentication Flow

* Users register and log in via API
* Backend returns JWT access token
* Token is stored in `localStorage`
* Requests include `Authorization: Bearer <token>`
* Backend resolves user and scopes all queries

---

## API Overview

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/auth/me`

### Core Resources

* Categories, Expenses, Incomes, Budgets (full CRUD)

### Analytics

* summary
* monthly totals
* cashflow
* category distribution
* trends
* predictions
* exchange rates

### Insights

* rule-based + optional AI

---

## Running Tests

### Backend

```bash
cd backend
python -m pytest
```

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

---

## Known Limitations

* JWT stored in `localStorage` (not production-grade security)
* Money values partially use `float` instead of `Decimal`
* Exchange rates are not historically accurate
* No dedicated frontend test suite
* Some analytics run in request-time Python (not fully optimized)

---

## Portfolio Notes

This project demonstrates:

* full-stack application design
* typed frontend/backend contracts
* authentication and user-scoped data access
* analytics and derived business logic
* incremental refactoring and system cleanup
* building maintainable UI systems

---