"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Minus,
  PiggyBank,
  ShoppingBag,
  Target,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import EmptyState from "@/components/ui/EmptyState";
import LoadingList from "@/components/ui/LoadingList";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import {
  useBudgetOverview,
  useCategories,
  useMonthlyTotals,
  useRecentExpenses,
  useRecentIncomes,
  useSummary,
} from "@/hooks/useData";
import { useCurrency } from "@/context/CurrencyContext";
import { formatDateShort, formatPercent } from "@/utils/formatters";

export default function DashboardPage() {
  const { summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useSummary();
  const {
    expenses: recentExpenses,
    loading: recentExpensesLoading,
    error: recentExpensesError,
    refetch: refetchRecentExpenses,
  } = useRecentExpenses(4);
  const {
    incomes: recentIncomes,
    loading: recentIncomesLoading,
    error: recentIncomesError,
    refetch: refetchRecentIncomes,
  } = useRecentIncomes(3);
  const {
    data: monthly,
    loading: monthlyLoading,
    error: monthlyError,
    refetch: refetchMonthly,
  } = useMonthlyTotals(6);
  const { categories, error: categoriesError } = useCategories();
  const {
    data: budgetOverview,
    loading: budgetLoading,
    error: budgetError,
    refetch: refetchBudgetOverview,
  } = useBudgetOverview();
  const { convertAndFormat } = useCurrency();
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    const refreshDashboard = () => {
      const now = Date.now();
      if (now - lastRefreshRef.current < 5000) {
        return;
      }

      lastRefreshRef.current = now;
      void refetchSummary();
      void refetchRecentExpenses();
      void refetchRecentIncomes();
      void refetchMonthly();
      void refetchBudgetOverview();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshDashboard();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", refreshDashboard);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", refreshDashboard);
    };
  }, [
    refetchBudgetOverview,
    refetchMonthly,
    refetchRecentExpenses,
    refetchRecentIncomes,
    refetchSummary,
  ]);

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );
  const topCategory = summary?.top_category_id ? categoryMap.get(summary.top_category_id) : null;
  const spendingUp = (summary?.month_change_percent ?? 0) > 0;
  const hasDashboardErrors = useMemo(
    () =>
      [
        summaryError,
        recentExpensesError,
        recentIncomesError,
        monthlyError,
        categoriesError,
        budgetError,
      ].filter(Boolean) as string[],
    [
      budgetError,
      categoriesError,
      monthlyError,
      recentExpensesError,
      recentIncomesError,
      summaryError,
    ]
  );

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Your income, spending, and budget health in one place"
      />

      <PageFeedback errorMessages={hasDashboardErrors} />

      <div className="stat-grid">
        <div className="stat-card animate-in animate-in-delay-1">
          <div
            className="stat-icon"
            style={{ background: "rgba(0,184,148,0.15)", color: "var(--accent-success)" }}
          >
            <DollarSign size={22} />
          </div>
          {summaryLoading ? (
            <div className="skeleton skeleton-heading" />
          ) : (
            <>
              <div className="stat-value">
                {convertAndFormat(summary?.total_income_this_month ?? 0, "USD")}
              </div>
              <div className="stat-label">Income this month</div>
              <div className="badge badge-primary" style={{ marginTop: 10 }}>
                Net {convertAndFormat(summary?.net_balance_this_month ?? 0, "USD")}
              </div>
            </>
          )}
        </div>

        <div className="stat-card animate-in animate-in-delay-2">
          <div
            className="stat-icon"
            style={{ background: "rgba(255,107,107,0.15)", color: "var(--accent-danger)" }}
          >
            <CreditCard size={22} />
          </div>
          {summaryLoading ? (
            <div className="skeleton skeleton-heading" />
          ) : (
            <>
              <div className="stat-value">{convertAndFormat(summary?.total_this_month ?? 0, "USD")}</div>
              <div className="stat-label">Spent this month</div>
              <div className={`stat-change ${spendingUp ? "negative" : "positive"}`}>
                {spendingUp ? (
                  <ArrowUpRight size={14} />
                ) : summary?.month_change_percent === 0 ? (
                  <Minus size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}
                {formatPercent(summary?.month_change_percent ?? 0)}
              </div>
            </>
          )}
        </div>

        <div className="stat-card animate-in animate-in-delay-3">
          <div
            className="stat-icon"
            style={{
              background: "rgba(124,106,239,0.15)",
              color: "var(--accent-primary-light)",
            }}
          >
            <Target size={22} />
          </div>
          {summaryLoading ? (
            <div className="skeleton skeleton-heading" />
          ) : (
            <>
              <div className="stat-value">{convertAndFormat(summary?.budget_remaining ?? 0, "USD")}</div>
              <div className="stat-label">Budget remaining</div>
              <div className="badge badge-primary" style={{ marginTop: 10 }}>
                {summary?.budget_usage_percent ?? 0}% used
              </div>
            </>
          )}
        </div>

        <div className="stat-card animate-in animate-in-delay-4">
          <div
            className="stat-icon"
            style={{
              background: topCategory ? `${topCategory.color}22` : "rgba(253,203,110,0.15)",
              color: topCategory?.color || "var(--accent-warning)",
            }}
          >
            <ShoppingBag size={22} />
          </div>
          {summaryLoading ? (
            <div className="skeleton skeleton-heading" />
          ) : (
            <>
              <div className="stat-value" style={{ fontSize: "var(--font-xl)" }}>
                {topCategory?.name || "-"}
              </div>
              <div className="stat-label">Top category</div>
              <div className="badge badge-primary" style={{ marginTop: 10 }}>
                {summary?.over_budget_categories_count ?? 0} over budget
              </div>
            </>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="animate-in animate-in-delay-2">
          {monthlyLoading ? (
            <div className="card">
              <div className="skeleton" style={{ height: 300 }} />
            </div>
          ) : monthlyError ? (
            <div className="card">
              <EmptyState
                title="Monthly chart unavailable"
                description="Try refreshing to reload your monthly spending totals."
                actionLabel="Retry"
                onAction={() => void refetchMonthly()}
                icon="!"
                compact
              />
            </div>
          ) : (
            <MonthlyBarChart data={monthly} />
          )}
        </div>

        <div className="card animate-in animate-in-delay-3">
          <div className="card-header">
            <h3 className="card-title">Budget Health</h3>
            <Link href="/budgets" className="btn btn-ghost btn-sm">
              Manage
            </Link>
          </div>
          {budgetLoading ? (
            <LoadingList count={4} height={44} />
          ) : budgetError ? (
            <EmptyState
              title="Budget overview unavailable"
              description="Try refreshing to reload your budget usage."
              actionLabel="Retry"
              onAction={() => void refetchBudgetOverview()}
              icon="!"
              compact
            />
          ) : budgetOverview.length === 0 ? (
            <EmptyState
              title="No budgets yet"
              description="Create monthly limits to track overspending."
              icon="%"
              compact
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {budgetOverview.slice(0, 4).map((item) => (
                <div
                  key={item.budget_id}
                  style={{
                    padding: "var(--space-sm)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-elevated)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="category-dot" style={{ background: item.category_color }} />
                      <strong style={{ fontSize: "var(--font-sm)" }}>{item.category_name}</strong>
                    </div>
                    <span
                      style={{
                        color: item.is_over_budget ? "var(--accent-danger)" : "var(--text-secondary)",
                        fontSize: "var(--font-xs)",
                      }}
                    >
                      {item.usage_percent}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(item.usage_percent, 100)}%`,
                        height: "100%",
                        background: item.is_over_budget ? "var(--accent-danger)" : item.category_color,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "var(--font-xs)",
                      color: "var(--text-secondary)",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>Spent {convertAndFormat(item.spent, "USD")}</span>
                    <span>Limit {convertAndFormat(item.amount, "USD")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="charts-grid">
        <div className="card animate-in animate-in-delay-2">
          <div className="card-header">
            <h3 className="card-title">Recent Income</h3>
            <Link href="/income" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <div className="expense-list">
            {recentIncomesLoading ? (
              <LoadingList count={3} height={52} />
            ) : recentIncomesError ? (
              <EmptyState
                title="Recent income unavailable"
                description="Try refreshing to reload your latest income entries."
                actionLabel="Retry"
                onAction={() => void refetchRecentIncomes()}
                icon="!"
                compact
              />
            ) : recentIncomes.length === 0 ? (
              <EmptyState
                title="No income recorded yet"
                description="Add income to see it here."
                icon="+"
                compact
              />
            ) : (
              recentIncomes.map((income) => (
                <div key={income.id} className="expense-item">
                  <div
                    className="stat-icon"
                    style={{
                      width: 38,
                      height: 38,
                      minWidth: 38,
                      background: "rgba(0,184,148,0.15)",
                      color: "var(--accent-success)",
                    }}
                  >
                    <PiggyBank size={16} />
                  </div>
                  <div className="expense-info">
                    <div className="expense-desc">{income.description}</div>
                    <div className="expense-meta">
                      {income.source} | {formatDateShort(income.income_date)}
                    </div>
                  </div>
                  <div className="expense-amount" style={{ color: "var(--accent-success)" }}>
                    +{convertAndFormat(income.amount, income.currency_code)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card animate-in animate-in-delay-3">
          <div className="card-header">
            <h3 className="card-title">Recent Expenses</h3>
            <Link href="/expenses" className="btn btn-ghost btn-sm">
              View all
            </Link>
          </div>
          <div className="expense-list">
            {recentExpensesLoading ? (
              <LoadingList count={4} height={52} />
            ) : recentExpensesError ? (
              <EmptyState
                title="Recent expenses unavailable"
                description="Try refreshing to reload your latest expenses."
                actionLabel="Retry"
                onAction={() => void refetchRecentExpenses()}
                icon="!"
                compact
              />
            ) : recentExpenses.length === 0 ? (
              <EmptyState
                title="No expenses yet"
                description="Add your first transaction to see it here."
                icon="-"
                compact
              />
            ) : (
              recentExpenses.map((expense) => {
                const category = categoryMap.get(expense.category_id);
                return (
                  <div key={expense.id} className="expense-item">
                    <div
                      className="category-dot"
                      style={{ background: category?.color || "#636e72" }}
                    />
                    <div className="expense-info">
                      <div className="expense-desc">{expense.description}</div>
                      <div className="expense-meta">
                        {category?.name || "Other"} | {formatDateShort(expense.expense_date)}
                      </div>
                    </div>
                    <div className="expense-amount">
                      -{convertAndFormat(expense.amount, expense.currency_code)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
