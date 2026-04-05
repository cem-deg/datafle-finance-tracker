# Datafle - Smart Finance Tracker

Modern full-stack personal finance tracker built with Next.js + FastAPI.

## Current Scope

- Expense tracking
- Income tracking
- Monthly category budgets
- Dashboard summary with net balance and budget usage
- Analytics and AI/rule-based insights

## Stack

- Frontend: Next.js 16, React 19, TypeScript
- Backend: FastAPI, SQLAlchemy, Alembic
- Local quick start database: SQLite
- Production direction: PostgreSQL

## Git Bash Local Setup

This guide is written only for `Git Bash`.

## Prerequisites

- Node.js 18+
- Python 3.11+

## 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.local.example` with this content:

```env
DATABASE_URL=sqlite:///./datafle.db
SECRET_KEY=dev-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=
EXCHANGE_API_KEY=
AUTO_CREATE_TABLES=true
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Run migrations:

```bash
./venv/Scripts/python.exe -m alembic upgrade head
```

Start backend:

```bash
./venv/Scripts/python.exe -m uvicorn app.main:app --reload --port 8000
```

Health check:

```text
http://localhost:8000/api/health
```

Expected response:

```json
{"status":"healthy","app":"Datafle","version":"1.0.0"}
```

## 2. Frontend Setup

Open a second Git Bash terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local` from `frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start frontend:

```bash
npm run dev
```

This project uses Webpack for local dev on Windows/Git Bash to avoid Turbopack hanging issues.

Open:

```text
http://localhost:3000
```

## Exact Start Order

Use this order every time:

1. Start backend
2. Confirm `http://localhost:8000/api/health`
3. Start frontend
4. Open `http://localhost:3000`
5. Register a new user

## If The App Gets Stuck On Loading

Check these in order.

### A. Backend is not running

Test in browser:

```text
http://localhost:8000/api/health
```

If it does not open, backend is down.

### B. `backend/.env` is pointing to PostgreSQL

For local quick start, use this:

```env
DATABASE_URL=sqlite:///./datafle.db
```

If `backend/.env` contains a PostgreSQL URL and you do not have PostgreSQL running locally, backend will fail to start.

### C. Old SQLite database is out of sync

If backend still fails after schema changes:

```bash
cd backend
rm -f datafle.db
./venv/Scripts/python.exe -m alembic upgrade head
```

Warning:

- this deletes local data

### D. Frontend cannot reach backend

Make sure:

- `frontend/.env.local` contains `NEXT_PUBLIC_API_URL=http://localhost:8000`
- backend is running on port `8000`
- frontend is running on port `3000`

### E. Frontend server opens but the page never finishes loading

Use the Webpack-based dev server:

```bash
cd frontend
npm run dev
```

The `dev` script is configured as:

```bash
next dev --webpack
```

If you were previously running plain `next dev`, stop it and restart with `npm run dev`.

## PostgreSQL Later

When you are ready to move off SQLite, update `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/datafle
```

Then run:

```bash
cd backend
./venv/Scripts/python.exe -m alembic upgrade head
```

Important:

- use PostgreSQL before real deployment
- keep SQLite only for quick local development if needed

### Local PostgreSQL With Docker

If you want to prepare the project for production without installing PostgreSQL manually, use the included Docker Compose file:

```bash
docker compose -f docker-compose.postgres.yml up -d
```

Then set `backend/.env` like this:

```env
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/datafle
SECRET_KEY=dev-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
GEMINI_API_KEY=
EXCHANGE_API_KEY=
AUTO_CREATE_TABLES=false
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Run migrations:

```bash
cd backend
./venv/Scripts/python.exe -m alembic upgrade head
```

When you are done:

```bash
docker compose -f docker-compose.postgres.yml down
```

## Release Prep

Before deployment, separate local and production config clearly.

### Backend env files

- Local template: `backend/.env.local.example`
- Production template: `backend/.env.production.example`

Recommended flow:

1. keep local development on SQLite with `backend/.env.local.example`
2. use PostgreSQL for staging/production with `backend/.env.production.example`
3. set `AUTO_CREATE_TABLES=false` in production
4. always run Alembic migrations in staging/production

### Frontend env files

- Local template: `frontend/.env.example`
- Production template: `frontend/.env.production.example`

Recommended flow:

1. local frontend points to `http://localhost:8000`
2. production frontend points to your deployed backend domain like `https://api.example.com`

## Deployment Readiness Checklist

Complete these before publishing:

1. move backend from SQLite to PostgreSQL
2. confirm `./venv/Scripts/python.exe -m alembic upgrade head` works on PostgreSQL
3. make sure `SECRET_KEY` is strong and unique in production
4. move API keys out of local `.env` and into hosting platform secrets
5. set production `CORS_ORIGINS` to your real frontend domain only
6. run backend tests:

```bash
cd backend
./venv/Scripts/python.exe -m pytest
```

7. run frontend checks:

```bash
cd frontend
npm run lint
npm run build
```

8. test these flows on staging:
- register
- login
- dashboard load
- income create/edit/delete
- expense create/edit/delete
- budget create/edit/delete
- analytics and insights pages
- logout and re-login

## Recommended Next Deployment Steps

After the UI cleanup, the next technical order should be:

1. switch backend to PostgreSQL locally
2. verify migrations on PostgreSQL
3. prepare deploy config for frontend and backend
4. deploy to a staging domain
5. run full manual QA on the live environment
6. fix any live-only issues before public release

## Useful Commands

### Backend tests

```bash
cd backend
./venv/Scripts/python.exe -m pytest
```

### Frontend lint

```bash
cd frontend
npm run lint
```

### Frontend production build

```bash
cd frontend
npm run build
```

## Main Endpoints

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
- `POST /api/expenses/`
- `PUT /api/expenses/{id}`
- `DELETE /api/expenses/{id}`

### Incomes

- `GET /api/incomes/`
- `GET /api/incomes/recent`
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

### Insights

- `GET /api/insights/`
