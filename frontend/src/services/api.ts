/**
 * API client - single source of truth for all backend communication.
 */

import type {
  AuthToken,
  Budget,
  BudgetCreate,
  BudgetUpdate,
  BudgetOverviewItem,
  CashflowPoint,
  Category,
  CategoryDistribution,
  CategoryPrediction,
  CategoryUpdate,
  DailyTrend,
  DashboardSummary,
  ExchangeRatesResponse,
  Expense,
  ExpenseCreate,
  ExpenseUpdate,
  ExpenseList,
  Income,
  IncomeCreate,
  IncomeList,
  IncomeUpdate,
  InsightResponse,
  MonthlyTotal,
  Prediction,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[] | null;

  constructor(message: string, status: number, errors?: { field: string; message: string }[] | null) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = "ApiError";
  }
}

function extractErrorMessage(error: unknown): {
  message: string;
  errors?: { field: string; message: string }[] | null;
} {
  if (!error || typeof error !== "object") {
    return { message: "Request failed" };
  }

  if ("detail" in error) {
    const detail = (error as { detail?: unknown }).detail;
    const errors = "errors" in error
      ? ((error as { errors?: { field: string; message: string }[] | null }).errors ?? null)
      : null;

    if (typeof detail === "string") {
      return { message: detail, errors };
    }

    if (Array.isArray(detail) && detail.length > 0) {
      const firstDetail = detail[0];
      if (typeof firstDetail === "string") {
        return { message: firstDetail, errors };
      }
      if (
        firstDetail &&
        typeof firstDetail === "object" &&
        "msg" in firstDetail &&
        typeof firstDetail.msg === "string"
      ) {
        return { message: firstDetail.msg, errors };
      }
    }
  }

  return { message: "Request failed" };
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("datafle_token");
}

function toQueryString(params?: Record<string, string | number | undefined>) {
  if (!params) return "";
  const filtered = Object.entries(params).filter(([, value]) => value !== undefined && value !== "");
  if (filtered.length === 0) return "";
  return `?${new URLSearchParams(filtered.map(([key, value]) => [key, String(value)])).toString()}`;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    const normalizedError = extractErrorMessage(error);
    throw new ApiError(normalizedError.message, response.status, normalizedError.errors);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    request<AuthToken>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<AuthToken>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),

  getMe: () => request<AuthToken["user"]>("/api/auth/me"),
};

export const categoryApi = {
  getAll: () => request<Category[]>("/api/categories/"),

  create: (data: { name: string; icon?: string; color?: string }) =>
    request<Category>("/api/categories/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: CategoryUpdate) =>
    request<Category>(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/api/categories/${id}`, { method: "DELETE" }),
};

export const expenseApi = {
  getAll: (params?: Record<string, string | number>) =>
    request<ExpenseList>(`/api/expenses/${toQueryString(params)}`),

  getRecent: (limit = 5) => request<Expense[]>(`/api/expenses/recent?limit=${limit}`),

  getById: (id: number) => request<Expense>(`/api/expenses/${id}`),

  create: (data: ExpenseCreate) =>
    request<Expense>("/api/expenses/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: ExpenseUpdate) =>
    request<Expense>(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/api/expenses/${id}`, { method: "DELETE" }),
};

export const incomeApi = {
  getAll: (params?: Record<string, string | number>) =>
    request<IncomeList>(`/api/incomes/${toQueryString(params)}`),

  getRecent: (limit = 5) => request<Income[]>(`/api/incomes/recent?limit=${limit}`),

  getById: (id: number) => request<Income>(`/api/incomes/${id}`),

  create: (data: IncomeCreate) =>
    request<Income>("/api/incomes/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: IncomeUpdate) =>
    request<Income>(`/api/incomes/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/api/incomes/${id}`, { method: "DELETE" }),
};

export const budgetApi = {
  getAll: (monthStart?: string) =>
    request<Budget[]>(`/api/budgets/${toQueryString({ month_start: monthStart })}`),

  create: (data: BudgetCreate) =>
    request<Budget>("/api/budgets/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: BudgetUpdate) =>
    request<Budget>(`/api/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request<void>(`/api/budgets/${id}`, { method: "DELETE" }),
};

export const analyticsApi = {
  getSummary: () => request<DashboardSummary>("/api/analytics/summary"),

  getMonthly: (months = 12) => request<MonthlyTotal[]>(`/api/analytics/monthly?months=${months}`),

  getCashflow: (months = 12) => request<CashflowPoint[]>(`/api/analytics/cashflow?months=${months}`),

  getCategoryDistribution: (startDate?: string, endDate?: string) => {
    const query = toQueryString({ start_date: startDate, end_date: endDate });
    return request<CategoryDistribution[]>(`/api/analytics/category-distribution${query}`);
  },

  getTrends: (days = 30) => request<DailyTrend[]>(`/api/analytics/trends?days=${days}`),

  getPrediction: () => request<Prediction>("/api/analytics/prediction"),

  getCategoryPredictions: () => request<CategoryPrediction[]>("/api/analytics/prediction/categories"),

  getBudgetOverview: (monthStart?: string) =>
    request<BudgetOverviewItem[]>(`/api/analytics/budgets/current${toQueryString({ month_start: monthStart })}`),

  getExchangeRates: (baseCurrency = "USD") =>
    request<ExchangeRatesResponse>(`/api/analytics/exchange-rates?base_currency=${encodeURIComponent(baseCurrency)}`),
};

export const insightsApi = {
  get: (mode: "rule" | "ai" = "rule") => request<InsightResponse>(`/api/insights/?mode=${mode}`),
};

export { ApiError };
