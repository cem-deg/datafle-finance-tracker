"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { analyticsApi, budgetApi, categoryApi, expenseApi, incomeApi } from "@/services/api";
import type {
  Budget,
  BudgetOverviewItem,
  CategoryDistribution,
  CashflowPoint,
  Category,
  DailyTrend,
  DashboardSummary,
  Expense,
  ExpenseList,
  Income,
  IncomeList,
  MonthlyTotal,
  Prediction,
} from "@/types";

export function useExpenses(params?: Record<string, string | number>) {
  const [data, setData] = useState<ExpenseList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paramsKey = JSON.stringify(params ?? {});
  const stableParams = useMemo(
    () => (paramsKey === "{}" ? undefined : (JSON.parse(paramsKey) as Record<string, string | number>)),
    [paramsKey]
  );

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await expenseApi.getAll(stableParams)) as ExpenseList;
      setData(res);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useRecentExpenses(limit = 5) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      setExpenses((await expenseApi.getRecent(limit)) as Expense[]);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { expenses, loading, refetch: fetch };
}

export function useIncomes(params?: Record<string, string | number>) {
  const [data, setData] = useState<IncomeList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paramsKey = JSON.stringify(params ?? {});
  const stableParams = useMemo(
    () => (paramsKey === "{}" ? undefined : (JSON.parse(paramsKey) as Record<string, string | number>)),
    [paramsKey]
  );

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await incomeApi.getAll(stableParams)) as IncomeList;
      setData(res);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load incomes");
    } finally {
      setLoading(false);
    }
  }, [stableParams]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useRecentIncomes(limit = 5) {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      setIncomes((await incomeApi.getRecent(limit)) as Income[]);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { incomes, loading, refetch: fetch };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      setCategories((await categoryApi.getAll()) as Category[]);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { categories, loading, refetch: fetch };
}

export function useBudgets(monthStart?: string) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      setBudgets((await budgetApi.getAll(monthStart)) as Budget[]);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [monthStart]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { budgets, loading, refetch: fetch };
}

export function useSummary() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getSummary()
      .then((d) => setSummary(d as DashboardSummary))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { summary, loading };
}

export function useMonthlyTotals(months = 12) {
  const [data, setData] = useState<MonthlyTotal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getMonthly(months)
      .then((d) => setData(d as MonthlyTotal[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [months]);

  return { data, loading };
}

export function useCashflow(months = 12) {
  const [data, setData] = useState<CashflowPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getCashflow(months)
      .then((d) => setData(d as CashflowPoint[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [months]);

  return { data, loading };
}

export function useCategoryDistribution() {
  const [data, setData] = useState<CategoryDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getCategoryDistribution()
      .then((d) => setData(d as CategoryDistribution[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useBudgetOverview(monthStart?: string) {
  const [data, setData] = useState<BudgetOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getBudgetOverview(monthStart)
      .then((d) => setData(d as BudgetOverviewItem[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [monthStart]);

  return { data, loading };
}

export function useTrends(days = 30) {
  const [data, setData] = useState<DailyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getTrends(days)
      .then((d) => setData(d as DailyTrend[]))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  return { data, loading };
}

export function usePrediction() {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getPrediction()
      .then((d) => setPrediction(d as Prediction))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { prediction, loading };
}
