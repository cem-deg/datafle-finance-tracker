"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDown,
  Award,
  Cpu,
  Flame,
  Lightbulb,
  PiggyBank,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import EmptyState from "@/components/ui/EmptyState";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import { insightsApi } from "@/services/api";
import {
  useCategoryDistribution,
  useCategories,
  useMonthlyTotals,
  useSummary,
} from "@/hooks/useData";
import { useCurrency } from "@/context/CurrencyContext";
import type { InsightResponse } from "@/types";

function SpendingHealthScore({ score, label }: { score: number; label: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70
      ? "var(--accent-success)"
      : score >= 40
        ? "var(--accent-warning)"
        : "var(--accent-danger)";

  return (
    <div className="health-score-card">
      <div className="score-ring">
        <svg viewBox="0 0 100 100">
          <circle className="ring-bg" cx="50" cy="50" r={radius} />
          <circle
            className="ring-fill"
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-text">
          <span className="score-value" style={{ color }}>
            {score}
          </span>
          <span className="score-label">Score</span>
        </div>
      </div>
      <div className="health-details">
        <h3>Financial Health</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const [mode, setMode] = useState<"rule" | "ai">("rule");
  const [insight, setInsight] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { summary, error: summaryError } = useSummary();
  const { data: categoryDistribution, error: categoryDistributionError } =
    useCategoryDistribution();
  const { categories, error: categoriesError } = useCategories();
  const { data: monthly, error: monthlyError } = useMonthlyTotals(3);
  const { convertAndFormat } = useCurrency();

  async function fetchInsights(nextMode: "rule" | "ai") {
    setError(null);
    try {
      const data = await insightsApi.get(nextMode);
      setInsight(data);
    } catch (requestError: unknown) {
      setInsight(null);
      setError(
        requestError instanceof Error ? requestError.message : "Failed to load insights"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchInsights(mode);
  }, [mode]);

  function handleModeChange(nextMode: "rule" | "ai") {
    if (nextMode === mode) return;
    setLoading(true);
    setMode(nextMode);
  }

  const change = summary?.month_change_percent ?? 0;
  const healthScore = Math.max(0, Math.min(100, Math.round(70 - change * 0.5)));
  const healthLabel =
    healthScore >= 70
      ? "You're doing great! Spending is well controlled this month."
      : healthScore >= 40
        ? "Room for improvement. Some categories are higher than usual."
        : "Spending is significantly higher than last month. Review your expenses.";

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );
  const sortedCategories = useMemo(
    () => [...categoryDistribution].sort((left, right) => right.amount - left.amount),
    [categoryDistribution]
  );
  const alerts = useMemo(() => {
    const nextAlerts: {
      icon: ReactNode;
      bg: string;
      color: string;
      title: string;
      desc: string;
    }[] = [];

    if (change > 20) {
      nextAlerts.push({
        icon: <Flame size={18} />,
        bg: "rgba(255,107,107,0.15)",
        color: "var(--accent-danger)",
        title: "Spending Spike Detected",
        desc: `Your spending is up ${change.toFixed(1)}% compared to last month. Consider reviewing recent transactions.`,
      });
    } else if (change < -10) {
      nextAlerts.push({
        icon: <Award size={18} />,
        bg: "rgba(0,184,148,0.15)",
        color: "var(--accent-success)",
        title: "Great Savings!",
        desc: `You've reduced spending by ${Math.abs(change).toFixed(1)}% this month. Keep up the great work!`,
      });
    }

    if (sortedCategories.length > 0) {
      const topCategory = categoryMap.get(sortedCategories[0].category_id);
      const savingsTarget = sortedCategories[0].amount * 0.15;
      if (topCategory && sortedCategories[0].percentage > 30) {
        nextAlerts.push({
          icon: <Target size={18} />,
          bg: "rgba(253,203,110,0.15)",
          color: "var(--accent-warning)",
          title: `${topCategory.name} is ${sortedCategories[0].percentage}% of spending`,
          desc: `Reducing ${topCategory.name} by 15% could save you ${convertAndFormat(
            savingsTarget,
            "USD"
          )} this month.`,
        });
      }
    }

    if ((summary?.avg_per_transaction ?? 0) > 50) {
      nextAlerts.push({
        icon: <AlertTriangle size={18} />,
        bg: "rgba(162,155,254,0.15)",
        color: "var(--accent-primary-light)",
        title: "High Average Transaction",
        desc: `Your average transaction is ${convertAndFormat(
          summary?.avg_per_transaction ?? 0,
          "USD"
        )}. Splitting larger purchases could help track spending better.`,
      });
    }

    if (monthly.length >= 2) {
      const trendUp = monthly[monthly.length - 1]?.total > monthly[monthly.length - 2]?.total;
      nextAlerts.push({
        icon: trendUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
        bg: trendUp ? "rgba(255,107,107,0.15)" : "rgba(0,184,148,0.15)",
        color: trendUp ? "var(--accent-danger)" : "var(--accent-success)",
        title: trendUp ? "Upward Spending Trend" : "Spending is Decreasing",
        desc: trendUp
          ? "Your monthly spending has been increasing. Setting a budget could help."
          : "Your monthly spending is trending downward. You're on the right track!",
      });
    }

    return nextAlerts;
  }, [categoryMap, change, convertAndFormat, monthly, sortedCategories, summary?.avg_per_transaction]);
  const savingsOpportunities = useMemo(
    () =>
      sortedCategories.slice(0, 3).map((item) => ({
        name: categoryMap.get(item.category_id)?.name ?? "Unknown",
        color: categoryMap.get(item.category_id)?.color ?? "#636e72",
        potential: item.amount * 0.1,
        percentage: item.percentage,
      })),
    [categoryMap, sortedCategories]
  );

  const pageErrors = useMemo(
    () =>
      [
        error,
        summaryError,
        categoryDistributionError,
        categoriesError,
        monthlyError,
      ].filter(Boolean) as string[],
    [categoriesError, categoryDistributionError, error, monthlyError, summaryError]
  );

  return (
    <AppShell>
      <PageHeader
        title="Smart Insights"
        description="Personalized financial analysis and recommendations"
        actions={
          <div className="insight-mode-toggle">
            <button
              className={`insight-mode-btn ${mode === "rule" ? "active" : ""}`}
              onClick={() => handleModeChange("rule")}
              id="mode-rule"
            >
              <Cpu size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
              Rule-based
            </button>
            <button
              className={`insight-mode-btn ${mode === "ai" ? "active" : ""}`}
              onClick={() => handleModeChange("ai")}
              id="mode-ai"
            >
              <Sparkles
                size={14}
                style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }}
              />
              AI-Powered
            </button>
          </div>
        }
      />

      <PageFeedback errorMessages={pageErrors} />

      <div className="insights-grid animate-in animate-in-delay-1">
        <SpendingHealthScore score={healthScore} label={healthLabel} />

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-md)" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-md)",
                background: "rgba(0,184,148,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent-success)",
              }}
            >
              <PiggyBank size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "var(--font-md)", fontWeight: 700 }}>Savings Opportunities</h3>
              <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>
                Reduce top categories by 10%
              </p>
            </div>
          </div>
          {savingsOpportunities.length === 0 ? (
            <p style={{ fontSize: "var(--font-sm)", color: "var(--text-tertiary)" }}>
              Add expenses to see savings opportunities
            </p>
          ) : (
            savingsOpportunities.map((opportunity) => (
              <div key={opportunity.name} className="savings-item">
                <div style={{ minWidth: 80 }}>
                  <div style={{ fontSize: "var(--font-xs)", fontWeight: 600 }}>
                    {opportunity.name}
                  </div>
                  <div style={{ fontSize: "var(--font-xs)", color: "var(--text-tertiary)" }}>
                    {opportunity.percentage}%
                  </div>
                </div>
                <div className="savings-bar-wrap">
                  <div
                    className="savings-bar"
                    style={{
                      width: `${opportunity.percentage}%`,
                      background: opportunity.color,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "var(--font-xs)",
                    color: "var(--accent-success)",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  <ArrowDown size={12} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
                  {convertAndFormat(opportunity.potential, "USD")}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="animate-in animate-in-delay-2" style={{ marginBottom: "var(--space-lg)" }}>
        <h3 style={{ fontSize: "var(--font-md)", fontWeight: 700, marginBottom: "var(--space-md)" }}>
          Smart Alerts
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {alerts.length === 0 ? (
            <div className="smart-alert">
              <div
                className="alert-icon"
                style={{
                  background: "rgba(124,106,239,0.15)",
                  color: "var(--accent-primary-light)",
                }}
              >
                <Lightbulb size={18} />
              </div>
              <div className="alert-content">
                <div className="alert-title">No alerts yet</div>
                <div className="alert-desc">
                  Add more expenses to get personalized alerts and recommendations.
                </div>
              </div>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div key={index} className="smart-alert">
                <div className="alert-icon" style={{ background: alert.bg, color: alert.color }}>
                  {alert.icon}
                </div>
                <div className="alert-content">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-desc">{alert.desc}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="animate-in animate-in-delay-3">
        {loading ? (
          <div className="card">
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-text" style={{ width: "100%" }} />
            <div className="skeleton skeleton-text" style={{ width: "90%" }} />
            <div className="skeleton skeleton-text" style={{ width: "85%" }} />
          </div>
        ) : error ? (
          <div className="card">
            <EmptyState
              title="Insights unavailable"
              description="The latest insights could not be loaded right now."
              actionLabel="Retry"
              onAction={() => {
                setLoading(true);
                void fetchInsights(mode);
              }}
              icon="!"
              compact
            />
          </div>
        ) : (
          <div className="card" style={{ position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  mode === "ai" ? "var(--gradient-primary)" : "var(--gradient-accent)",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background:
                    mode === "ai"
                      ? "rgba(0, 210, 211, 0.15)"
                      : "rgba(124, 106, 239, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    mode === "ai"
                      ? "var(--accent-secondary)"
                      : "var(--accent-primary-light)",
                }}
              >
                {mode === "ai" ? <Sparkles size={22} /> : <Lightbulb size={22} />}
              </div>
              <div>
                <h3 style={{ fontSize: "var(--font-lg)", fontWeight: 700 }}>
                  {mode === "ai" ? "AI-Powered Insights" : "Financial Insights"}
                </h3>
                <p style={{ fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>
                  {insight?.provider === "gemini"
                    ? "Powered by Google Gemini"
                    : "Rule-based analysis"}
                </p>
              </div>
            </div>
            <div
              className="insight-card"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {insight?.insight || "No insights available. Add some expenses to get started!"}
            </div>
            {mode === "ai" ? (
              <button
                className="btn btn-secondary mt-lg"
                onClick={() => {
                  setLoading(true);
                  void fetchInsights("ai");
                }}
                id="regenerate-insights"
              >
                <Sparkles size={16} /> Regenerate
              </button>
            ) : null}
          </div>
        )}
      </div>
    </AppShell>
  );
}
