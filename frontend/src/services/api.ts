/**
 * API client - single source of truth for all backend communication.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
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
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new ApiError(error.detail || "Request failed", response.status);
  }

  if (response.status === 204) return {} as T;
  return response.json();
}

export const authApi = {
  register: (data: { email: string; name: string; password: string }) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),

  getMe: () => request("/api/auth/me"),
};

export const categoryApi = {
  getAll: () => request("/api/categories/"),

  create: (data: { name: string; icon?: string; color?: string }) =>
    request("/api/categories/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: { name?: string; icon?: string; color?: string }) =>
    request(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request(`/api/categories/${id}`, { method: "DELETE" }),
};

export const expenseApi = {
  getAll: (params?: Record<string, string | number>) =>
    request(`/api/expenses/${toQueryString(params)}`),

  getRecent: (limit = 5) => request(`/api/expenses/recent?limit=${limit}`),

  getById: (id: number) => request(`/api/expenses/${id}`),

  create: (data: {
    amount: number;
    description: string;
    category_id: number;
    expense_date: string;
    currency_code?: string;
  }) => request("/api/expenses/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/expenses/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request(`/api/expenses/${id}`, { method: "DELETE" }),
};

export const incomeApi = {
  getAll: (params?: Record<string, string | number>) =>
    request(`/api/incomes/${toQueryString(params)}`),

  getRecent: (limit = 5) => request(`/api/incomes/recent?limit=${limit}`),

  create: (data: {
    amount: number;
    description: string;
    income_date: string;
    source?: string;
    currency_code?: string;
  }) => request("/api/incomes/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/incomes/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request(`/api/incomes/${id}`, { method: "DELETE" }),
};

export const budgetApi = {
  getAll: (monthStart?: string) =>
    request(`/api/budgets/${toQueryString({ month_start: monthStart })}`),

  create: (data: {
    amount: number;
    month_start: string;
    category_id: number;
    note?: string;
  }) => request("/api/budgets/", { method: "POST", body: JSON.stringify(data) }),

  update: (id: number, data: Record<string, unknown>) =>
    request(`/api/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  delete: (id: number) => request(`/api/budgets/${id}`, { method: "DELETE" }),
};

export const analyticsApi = {
  getSummary: () => request("/api/analytics/summary"),

  getMonthly: (months = 12) => request(`/api/analytics/monthly?months=${months}`),

  getCashflow: (months = 12) => request(`/api/analytics/cashflow?months=${months}`),

  getCategoryDistribution: (startDate?: string, endDate?: string) => {
    const query = toQueryString({ start_date: startDate, end_date: endDate });
    return request(`/api/analytics/category-distribution${query}`);
  },

  getTrends: (days = 30) => request(`/api/analytics/trends?days=${days}`),

  getPrediction: () => request("/api/analytics/prediction"),

  getCategoryPredictions: () => request("/api/analytics/prediction/categories"),

  getBudgetOverview: (monthStart?: string) =>
    request(`/api/analytics/budgets/current${toQueryString({ month_start: monthStart })}`),
};

export const insightsApi = {
  get: (mode: "rule" | "ai" = "rule") => request(`/api/insights/?mode=${mode}`),
};

export { ApiError };
