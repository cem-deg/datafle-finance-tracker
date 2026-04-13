"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Gauge,
  Minus,
  PiggyBank,
  Target,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import BudgetUsageList from "@/components/ui/BudgetUsageList";
import EmptyState from "@/components/ui/EmptyState";
import LoadingList from "@/components/ui/LoadingList";
import PanelCard from "@/components/ui/PanelCard";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import RecordRow from "@/components/ui/RecordRow";
import SectionIntro from "@/components/ui/SectionIntro";
import StateSurface from "@/components/ui/StateSurface";
import StatCard from "@/components/ui/StatCard";
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
  const summaryBaseCurrency = summary?.base_currency ?? "USD";
  const monthlyBaseCurrency = monthly[0]?.base_currency ?? "USD";
  const budgetOverviewBaseCurrency = budgetOverview[0]?.base_currency ?? "USD";
  const spendingUp = (summary?.month_change_percent ?? 0) > 0;
  const healthScore = Math.max(0, Math.min(100, Math.round(70 - (summary?.month_change_percent ?? 0) * 0.5)));
  const healthSignalLabel = healthScore >= 70 ? "On track" : healthScore >= 40 ? "Watch spending" : "Overspending";
  const healthIconClass = healthScore >= 70 ? "metric-icon-success" : healthScore >= 40 ? "metric-icon-warning" : "metric-icon-danger";
  const healthBadgeClass = healthScore >= 70 ? "badge-success" : healthScore >= 40 ? "badge-warning" : "badge-danger";
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
    <AppShell className="app-layout-dashboard">
      <div className="dashboard-shell">
        <PageHeader
          title="Dashboard"
          description="Your income, spending, and budget health in one place"
        />

        <PageFeedback errorMessages={hasDashboardErrors} />

        {/* ── Section 1: Primary summary ───────────────────────── */}
        <section className="dashboard-section">
          <SectionIntro
            eyebrow="Overview"
            title="This month at a glance"
          />

          <div className="dashboard-kpi-grid">
            <StatCard
              className="dashboard-kpi-card dashboard-kpi-card-primary animate-in animate-in-delay-1"
              icon={<CreditCard size={22} />}
              iconClassName="metric-icon-danger"
              label="Spent this month"
              loading={summaryLoading}
              value={convertAndFormat(summary?.total_this_month ?? 0, summaryBaseCurrency)}
              meta={
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
              }
            />

            <StatCard
              className="dashboard-kpi-card animate-in animate-in-delay-2"
              icon={<Target size={22} />}
              iconClassName="metric-icon"
              label="Budget remaining"
              loading={summaryLoading}
              value={convertAndFormat(summary?.budget_remaining ?? 0, summaryBaseCurrency)}
              meta={
                <div className="badge badge-primary mt-sm">
                  {summary?.budget_usage_percent ?? 0}% used
                </div>
              }
            />

            <StatCard
              className="dashboard-kpi-card animate-in animate-in-delay-3"
              icon={<Gauge size={22} />}
              iconClassName={healthIconClass}
              label="Financial Health"
              loading={summaryLoading}
              value={healthSignalLabel}
              valueClassName="stat-value-compact"
              meta={
                <div className={`badge ${healthBadgeClass} mt-sm`}>
                  Score {healthScore}
                </div>
              }
            />
          </div>
        </section>

        {/* ── Section 2: Budget health + recent expenses ───────── */}
        <section className="dashboard-section">
          <SectionIntro
            eyebrow="Spending"
            title="Budget health and recent expenses"
          />

          <div className="dashboard-activity-grid">
            <PanelCard
              className="dashboard-panel animate-in animate-in-delay-1"
              title="Budget Health"
              subtitle="Top categories vs. current limits"
              action={
                <Link href="/budgets" className="btn btn-ghost btn-sm">
                  Manage
                </Link>
              }
            >
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
                <BudgetUsageList
                  items={budgetOverview.slice(0, 4)}
                  renderIcon={(item) => (
                    <span className="category-dot" style={{ background: item.category_color }} />
                  )}
                  renderMeta={(item) => (
                    <>
                      <span>Spent {convertAndFormat(item.spent, item.base_currency || budgetOverviewBaseCurrency)}</span>
                      <span>Limit {convertAndFormat(item.amount, item.base_currency || budgetOverviewBaseCurrency)}</span>
                    </>
                  )}
                />
              )}
            </PanelCard>

            <PanelCard
              className="dashboard-panel animate-in animate-in-delay-2"
              title="Recent Expenses"
              subtitle="Latest 4 transactions"
              action={
                <Link href="/expenses" className="btn btn-ghost btn-sm">
                  View all
                </Link>
              }
              bodyClassName="expense-list"
            >
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
                    <RecordRow
                      key={expense.id}
                      leading={
                        <div
                          className="category-dot"
                          style={{ background: category?.color || "var(--color-muted)" }}
                        />
                      }
                      title={expense.description}
                      meta={`${category?.name || "Other"} | ${formatDateShort(expense.expense_date)}`}
                      amount={`-${convertAndFormat(expense.amount, expense.currency_code)}`}
                    />
                  );
                })
              )}
            </PanelCard>
          </div>
        </section>

        {/* ── Section 3: Spending trend (context) ──────────────── */}
        <section className="dashboard-section dashboard-section-secondary">
          <SectionIntro
            eyebrow="Trends"
            title="Spending trend"
          />

          <div className="dashboard-panel animate-in animate-in-delay-1">
            {monthlyLoading ? (
              <StateSurface type="loading" framed />
            ) : monthlyError ? (
              <StateSurface
                type="error"
                framed
                title="Monthly chart unavailable"
                description="Try refreshing to reload your monthly spending totals."
                actionLabel="Retry"
                onAction={() => void refetchMonthly()}
                icon="!"
                compact
              />
            ) : monthly.length === 0 ? (
              <StateSurface
                type="empty"
                framed
                title="No monthly activity yet"
                description="Add a few transactions to start seeing your spending trend."
                icon="~"
                compact
              />
            ) : (
              <MonthlyBarChart
                data={monthly}
                baseCurrency={monthlyBaseCurrency}
                title="Spending trend"
                periodLabel="Last 6 months"
              />
            )}
          </div>
        </section>

        {/* ── Section 4: Income overview (below fold) ──────────── */}
        <section className="dashboard-section dashboard-section-secondary">
          <SectionIntro
            eyebrow="Income"
            title="Income overview"
          />

          <div className="dashboard-activity-grid">
            <StatCard
              className="dashboard-kpi-card animate-in animate-in-delay-1"
              icon={<DollarSign size={22} />}
              iconClassName="metric-icon-success"
              label="Income this month"
              loading={summaryLoading}
              value={convertAndFormat(summary?.total_income_this_month ?? 0, summaryBaseCurrency)}
              meta={
                <div className="badge badge-primary mt-sm">
                  Net {convertAndFormat(summary?.net_balance_this_month ?? 0, summaryBaseCurrency)}
                </div>
              }
            />

            <PanelCard
              className="dashboard-panel animate-in animate-in-delay-2"
              title="Recent Income"
              subtitle="Latest 3 entries"
              action={
                <Link href="/income" className="btn btn-ghost btn-sm">
                  View all
                </Link>
              }
              bodyClassName="expense-list"
            >
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
                  <RecordRow
                    key={income.id}
                    leading={
                      <div className="stat-icon metric-icon-success metric-icon-sm">
                        <PiggyBank size={16} />
                      </div>
                    }
                    title={income.description}
                    meta={`${income.source} | ${formatDateShort(income.income_date)}`}
                    amount={`+${convertAndFormat(income.amount, income.currency_code)}`}
                    amountClassName="amount-positive"
                  />
                ))
              )}
            </PanelCard>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
