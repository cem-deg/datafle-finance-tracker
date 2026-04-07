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
  Expense,
  Income,
  MonthlyTotal,
} from "@/types";

type QueryParams = Record<string, string | number>;

interface AsyncResourceOptions<T> {
  initialData: T;
  errorMessage?: string;
  silent?: boolean;
}

function normalizeError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function useStableParams(params?: QueryParams): QueryParams | undefined {
  const paramsKey = JSON.stringify(params ?? {});
  return useMemo(
    () => (paramsKey === "{}" ? undefined : (JSON.parse(paramsKey) as QueryParams)),
    [paramsKey]
  );
}

function useAsyncResource<T>(
  loader: () => Promise<T>,
  options: AsyncResourceOptions<T>
) {
  const { initialData, errorMessage = "Failed to load data", silent = false } = options;
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await loader();
      setData(response);
      setError(null);
    } catch (e: unknown) {
      if (!silent) {
        setError(normalizeError(e, errorMessage));
      }
    } finally {
      setLoading(false);
    }
  }, [loader, errorMessage, silent]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useExpenses(params?: QueryParams) {
  const stableParams = useStableParams(params);
  const loader = useCallback(() => expenseApi.getAll(stableParams), [stableParams]);

  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: null,
    errorMessage: "Failed to load expenses",
  });

  return { data, loading, error, refetch };
}

export function useRecentExpenses(limit = 5) {
  const loader = useCallback(() => expenseApi.getRecent(limit), [limit]);
  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: [] as Expense[],
    errorMessage: "Failed to load recent expenses",
  });

  return { expenses: data, loading, error, refetch };
}

export function useIncomes(params?: QueryParams) {
  const stableParams = useStableParams(params);
  const loader = useCallback(() => incomeApi.getAll(stableParams), [stableParams]);

  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: null,
    errorMessage: "Failed to load incomes",
  });

  return { data, loading, error, refetch };
}

export function useRecentIncomes(limit = 5) {
  const loader = useCallback(() => incomeApi.getRecent(limit), [limit]);
  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: [] as Income[],
    errorMessage: "Failed to load recent income",
  });

  return { incomes: data, loading, error, refetch };
}

export function useCategories() {
  const loader = useCallback(() => categoryApi.getAll(), []);
  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: [] as Category[],
    errorMessage: "Failed to load categories",
  });

  return { categories: data, loading, error, refetch };
}

export function useBudgets(monthStart?: string) {
  const loader = useCallback(() => budgetApi.getAll(monthStart), [monthStart]);
  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: [] as Budget[],
    errorMessage: "Failed to load budgets",
  });

  return { budgets: data, loading, error, refetch };
}

export function useSummary() {
  const loader = useCallback(() => analyticsApi.getSummary(), []);
  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: null,
    errorMessage: "Failed to load dashboard summary",
  });

  return { summary: data, loading, error, refetch };
}

export function useMonthlyTotals(months = 12) {
  const loader = useCallback(() => analyticsApi.getMonthly(months), [months]);
  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: [] as MonthlyTotal[],
    errorMessage: "Failed to load monthly totals",
  });

  return { data, loading, error, refetch };
}

export function useCashflow(months = 12) {
  const loader = useCallback(() => analyticsApi.getCashflow(months), [months]);
  const { data, loading, error } = useAsyncResource(loader, {
    initialData: [] as CashflowPoint[],
    errorMessage: "Failed to load cashflow data",
  });

  return { data, loading, error };
}

export function useCategoryDistribution() {
  const loader = useCallback(() => analyticsApi.getCategoryDistribution(), []);
  const { data, loading, error } = useAsyncResource(loader, {
    initialData: [] as CategoryDistribution[],
    errorMessage: "Failed to load category distribution",
  });

  return { data, loading, error };
}

export function useBudgetOverview(monthStart?: string) {
  const loader = useCallback(
    () => analyticsApi.getBudgetOverview(monthStart),
    [monthStart]
  );
  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: [] as BudgetOverviewItem[],
    errorMessage: "Failed to load budget overview",
  });

  return { data, loading, error, refetch };
}

export function useTrends(days = 30) {
  const loader = useCallback(() => analyticsApi.getTrends(days), [days]);
  const { data, loading, error } = useAsyncResource(loader, {
    initialData: [] as DailyTrend[],
    errorMessage: "Failed to load trend data",
  });

  return { data, loading, error };
}

export function usePrediction() {
  const loader = useCallback(() => analyticsApi.getPrediction(), []);
  const { data, loading, error } = useAsyncResource(loader, {
    initialData: null,
    errorMessage: "Failed to load prediction",
  });

  return { prediction: data, loading, error };
}
