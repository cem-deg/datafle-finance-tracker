"use client";

import AppShell from "@/components/layout/AppShell";
import {
  useBudgetOverview,
  useCategories,
  useMonthlyTotals,
  useRecentExpenses,
  useRecentIncomes,
  useSummary,
} from "@/hooks/useData";
import { useCurrency } from "@/context/CurrencyContext";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import { formatDateShort, formatPercent } from "@/utils/formatters";
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

export default function DashboardPage() {
  const { summary, loading: summaryLoading } = useSummary();
  const { expenses: recentExpenses, loading: recentExpensesLoading } = useRecentExpenses(4);
  const { incomes: recentIncomes, loading: recentIncomesLoading } = useRecentIncomes(3);
  const { data: monthly, loading: monthlyLoading } = useMonthlyTotals(6);
  const { categories } = useCategories();
  const { data: budgetOverview, loading: budgetLoading } = useBudgetOverview();
  const { convertAndFormat } = useCurrency();

  const catMap = new Map(categories.map((category) => [category.id, category]));
  const topCategory = summary?.top_category_id ? catMap.get(summary.top_category_id) : null;
  const spendingUp = (summary?.month_change_percent ?? 0) > 0;

  return (
    <AppShell>
      <div className="page-header animate-in">
        <h1>Dashboard</h1>
        <p>Your income, spending, and budget health in one place</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card animate-in animate-in-delay-1">
          <div className="stat-icon" style={{ background: "rgba(0,184,148,0.15)", color: "var(--accent-success)" }}>
            <DollarSign size={22} />
          </div>
          {summaryLoading ? <div className="skeleton skeleton-heading" /> : (
            <>
              <div className="stat-value">{convertAndFormat(summary?.total_income_this_month ?? 0, "USD")}</div>
              <div className="stat-label">Income this month</div>
              <div className="badge badge-primary" style={{ marginTop: 10 }}>
                Net {convertAndFormat(summary?.net_balance_this_month ?? 0, "USD")}
              </div>
            </>
          )}
        </div>

        <div className="stat-card animate-in animate-in-delay-2">
          <div className="stat-icon" style={{ background: "rgba(255,107,107,0.15)", color: "var(--accent-danger)" }}>
            <CreditCard size={22} />
          </div>
          {summaryLoading ? <div className="skeleton skeleton-heading" /> : (
            <>
              <div className="stat-value">{convertAndFormat(summary?.total_this_month ?? 0, "USD")}</div>
              <div className="stat-label">Spent this month</div>
              <div className={`stat-change ${spendingUp ? "negative" : "positive"}`}>
                {spendingUp ? <ArrowUpRight size={14} /> : summary?.month_change_percent === 0 ? <Minus size={14} /> : <ArrowDownRight size={14} />}
                {formatPercent(summary?.month_change_percent ?? 0)}
              </div>
            </>
          )}
        </div>

        <div className="stat-card animate-in animate-in-delay-3">
          <div className="stat-icon" style={{ background: "rgba(124,106,239,0.15)", color: "var(--accent-primary-light)" }}>
            <Target size={22} />
          </div>
          {summaryLoading ? <div className="skeleton skeleton-heading" /> : (
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
          <div className="stat-icon" style={{ background: topCategory ? `${topCategory.color}22` : "rgba(253,203,110,0.15)", color: topCategory?.color || "var(--accent-warning)" }}>
            <ShoppingBag size={22} />
          </div>
          {summaryLoading ? <div className="skeleton skeleton-heading" /> : (
            <>
              <div className="stat-value" style={{ fontSize: "var(--font-xl)" }}>{topCategory?.name || "-"}</div>
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
            <div className="card"><div className="skeleton" style={{ height: 300 }} /></div>
          ) : (
            <MonthlyBarChart data={monthly} />
          )}
        </div>

        <div className="card animate-in animate-in-delay-3">
          <div className="card-header">
            <h3 className="card-title">Budget Health</h3>
            <a href="/budgets" className="btn btn-ghost btn-sm">Manage</a>
          </div>
          {budgetLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="skeleton" style={{ height: 44, marginBottom: 8 }} />
            ))
          ) : budgetOverview.length === 0 ? (
            <div className="empty-state" style={{ padding: "var(--space-xl)" }}>
              <p>No budgets yet. Create monthly limits to track overspending.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {budgetOverview.slice(0, 4).map((item) => (
                <div key={item.budget_id} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-md)", background: "var(--bg-elevated)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="category-dot" style={{ background: item.category_color }} />
                      <strong style={{ fontSize: "var(--font-sm)" }}>{item.category_name}</strong>
                    </div>
                    <span style={{ color: item.is_over_budget ? "var(--accent-danger)" : "var(--text-secondary)", fontSize: "var(--font-xs)" }}>
                      {item.usage_percent}%
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden", marginBottom: 8 }}>
                    <div
                      style={{
                        width: `${Math.min(item.usage_percent, 100)}%`,
                        height: "100%",
                        background: item.is_over_budget ? "var(--accent-danger)" : item.category_color,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>
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
            <a href="/income" className="btn btn-ghost btn-sm">View all</a>
          </div>
          <div className="expense-list">
            {recentIncomesLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
              ))
            ) : recentIncomes.length === 0 ? (
              <div className="empty-state" style={{ padding: "var(--space-xl)" }}>
                <p>No income recorded yet.</p>
              </div>
            ) : (
              recentIncomes.map((income) => (
                <div key={income.id} className="expense-item">
                  <div className="stat-icon" style={{ width: 38, height: 38, minWidth: 38, background: "rgba(0,184,148,0.15)", color: "var(--accent-success)" }}>
                    <PiggyBank size={16} />
                  </div>
                  <div className="expense-info">
                    <div className="expense-desc">{income.description}</div>
                    <div className="expense-meta">{income.source} · {formatDateShort(income.income_date)}</div>
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
            <a href="/expenses" className="btn btn-ghost btn-sm">View all</a>
          </div>
          <div className="expense-list">
            {recentExpensesLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton" style={{ height: 52, marginBottom: 8 }} />
              ))
            ) : recentExpenses.length === 0 ? (
              <div className="empty-state" style={{ padding: "var(--space-xl)" }}>
                <p>No expenses yet. Add your first transaction.</p>
              </div>
            ) : (
              recentExpenses.map((expense) => {
                const category = catMap.get(expense.category_id);
                return (
                  <div key={expense.id} className="expense-item">
                    <div className="category-dot" style={{ background: category?.color || "#636e72" }} />
                    <div className="expense-info">
                      <div className="expense-desc">{expense.description}</div>
                      <div className="expense-meta">{category?.name || "Other"} · {formatDateShort(expense.expense_date)}</div>
                    </div>
                    <div className="expense-amount">-{convertAndFormat(expense.amount, expense.currency_code)}</div>
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
