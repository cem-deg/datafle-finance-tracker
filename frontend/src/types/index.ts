/**
 * TypeScript type definitions for the Datafle application.
 */

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  is_default: boolean;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  icon?: string;
  color?: string;
}

export interface Expense {
  id: number;
  amount: number;
  description: string;
  expense_date: string;
  category_id: number;
  currency_code: string;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreate {
  amount: number;
  description: string;
  category_id: number;
  expense_date: string;
  currency_code?: string;
}

export interface ExpenseUpdate {
  amount?: number;
  description?: string;
  category_id?: number;
  expense_date?: string;
  currency_code?: string;
}

export interface ExpenseList {
  items: Expense[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Income {
  id: number;
  amount: number;
  description: string;
  income_date: string;
  source: string;
  currency_code: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeCreate {
  amount: number;
  description: string;
  income_date: string;
  source?: string;
  currency_code?: string;
}

export interface IncomeList {
  items: Income[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface Budget {
  id: number;
  amount: number;
  month_start: string;
  category_id: number;
  note?: string | null;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface BudgetCreate {
  amount: number;
  month_start: string;
  category_id: number;
  note?: string;
}

export interface BudgetOverviewItem {
  budget_id: number;
  category_id: number;
  category_name: string;
  category_color: string;
  amount: number;
  spent: number;
  remaining: number;
  usage_percent: number;
  is_over_budget: boolean;
  month_start: string;
  note?: string | null;
}

export interface DashboardSummary {
  total_this_month: number;
  total_income_this_month: number;
  net_balance_this_month: number;
  total_last_month: number;
  month_change_percent: number;
  total_transactions: number;
  avg_per_transaction: number;
  top_category_id: number | null;
  highest_expense: number;
  total_budget_this_month: number;
  budget_remaining: number;
  budget_usage_percent: number;
  over_budget_categories_count: number;
}

export interface MonthlyTotal {
  month: string;
  total: number;
}

export interface CashflowPoint {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryDistribution {
  category_id: number;
  amount: number;
  percentage: number;
}

export interface DailyTrend {
  date: string;
  total: number;
}

export interface Prediction {
  prediction: number | null;
  confidence: string;
  r_squared?: number;
  trend?: string;
  slope?: number;
  data_points: number;
  message: string;
}

export interface InsightResponse {
  mode: string;
  provider: string;
  insight: string;
}
