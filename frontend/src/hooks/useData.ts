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
  const loader = useCallback(
    () => expenseApi.getAll(stableParams) as Promise<ExpenseList | null>,
    [stableParams]
  );

  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: null,
    errorMessage: "Failed to load expenses",
  });

  return { data, loading, error, refetch };
}

export function useRecentExpenses(limit = 5) {
  const loader = useCallback(() => expenseApi.getRecent(limit) as Promise<Expense[]>, [limit]);
  const { data, loading, refetch } = useAsyncResource(loader, {
    initialData: [] as Expense[],
    silent: true,
  });

  return { expenses: data, loading, refetch };
}

export function useIncomes(params?: QueryParams) {
  const stableParams = useStableParams(params);
  const loader = useCallback(
    () => incomeApi.getAll(stableParams) as Promise<IncomeList | null>,
    [stableParams]
  );

  const { data, loading, error, refetch } = useAsyncResource(loader, {
    initialData: null,
    errorMessage: "Failed to load incomes",
  });

  return { data, loading, error, refetch };
}

export function useRecentIncomes(limit = 5) {
  const loader = useCallback(() => incomeApi.getRecent(limit) as Promise<Income[]>, [limit]);
  const { data, loading, refetch } = useAsyncResource(loader, {
    initialData: [] as Income[],
    silent: true,
  });

  return { incomes: data, loading, refetch };
}

export function useCategories() {
  const loader = useCallback(() => categoryApi.getAll() as Promise<Category[]>, []);
  const { data, loading, refetch } = useAsyncResource(loader, {
    initialData: [] as Category[],
    silent: true,
  });

  return { categories: data, loading, refetch };
}

export function useBudgets(monthStart?: string) {
  const loader = useCallback(() => budgetApi.getAll(monthStart) as Promise<Budget[]>, [monthStart]);
  const { data, loading, refetch } = useAsyncResource(loader, {
    initialData: [] as Budget[],
    silent: true,
  });

  return { budgets: data, loading, refetch };
}

export function useSummary() {
  const loader = useCallback(() => analyticsApi.getSummary() as Promise<DashboardSummary | null>, []);
  const { data, loading, refetch } = useAsyncResource(loader, {
    initialData: null,
    silent: true,
  });

  return { summary: data, loading, refetch };
}

export function useMonthlyTotals(months = 12) {
  const loader = useCallback(() => analyticsApi.getMonthly(months) as Promise<MonthlyTotal[]>, [months]);
  const { data, loading, refetch } = useAsyncResource(loader, {
    initialData: [] as MonthlyTotal[],
    silent: true,
  });

  return { data, loading, refetch };
}

export function useCashflow(months = 12) {
  const loader = useCallback(() => analyticsApi.getCashflow(months) as Promise<CashflowPoint[]>, [months]);
  const { data, loading } = useAsyncResource(loader, {
    initialData: [] as CashflowPoint[],
    silent: true,
  });

  return { data, loading };
}

export function useCategoryDistribution() {
  const loader = useCallback(
    () => analyticsApi.getCategoryDistribution() as Promise<CategoryDistribution[]>,
    []
  );
  const { data, loading } = useAsyncResource(loader, {
    initialData: [] as CategoryDistribution[],
    silent: true,
  });

  return { data, loading };
}

export function useBudgetOverview(monthStart?: string) {
  const loader = useCallback(
    () => analyticsApi.getBudgetOverview(monthStart) as Promise<BudgetOverviewItem[]>,
    [monthStart]
  );
  const { data, loading, refetch } = useAsyncResource(loader, {
    initialData: [] as BudgetOverviewItem[],
    silent: true,
  });

  return { data, loading, refetch };
}

export function useTrends(days = 30) {
  const loader = useCallback(() => analyticsApi.getTrends(days) as Promise<DailyTrend[]>, [days]);
  const { data, loading } = useAsyncResource(loader, {
    initialData: [] as DailyTrend[],
    silent: true,
  });

  return { data, loading };
}

export function usePrediction() {
  const loader = useCallback(() => analyticsApi.getPrediction() as Promise<Prediction | null>, []);
  const { data, loading } = useAsyncResource(loader, {
    initialData: null,
    silent: true,
  });

  return { prediction: data, loading };
}
