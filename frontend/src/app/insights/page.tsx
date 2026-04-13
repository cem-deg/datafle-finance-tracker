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
import PanelCard from "@/components/ui/PanelCard";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import StateSurface from "@/components/ui/StateSurface";
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
      ? "var(--color-success)"
      : score >= 40
        ? "var(--color-warning)"
        : "var(--color-danger)";

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
  const summaryBaseCurrency = summary?.base_currency ?? "USD";
  const categoryDistributionBaseCurrency = categoryDistribution[0]?.base_currency ?? "USD";

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
        bg: "var(--color-danger-soft)",
        color: "var(--color-danger)",
        title: "Spending Spike Detected",
        desc: `Your spending is up ${change.toFixed(1)}% compared to last month. Consider reviewing recent transactions.`,
      });
    } else if (change < -10) {
      nextAlerts.push({
        icon: <Award size={18} />,
        bg: "var(--color-success-soft)",
        color: "var(--color-success)",
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
          bg: "var(--color-warning-soft)",
          color: "var(--color-warning)",
          title: `${topCategory.name} is ${sortedCategories[0].percentage}% of spending`,
          desc: `Reducing ${topCategory.name} by 15% could save you ${convertAndFormat(
            savingsTarget,
            categoryDistributionBaseCurrency
          )} this month.`,
        });
      }
    }

    if ((summary?.avg_per_transaction ?? 0) > 50) {
      nextAlerts.push({
        icon: <AlertTriangle size={18} />,
        bg: "var(--color-info-soft)",
        color: "var(--color-info)",
        title: "High Average Transaction",
        desc: `Your average transaction is ${convertAndFormat(
          summary?.avg_per_transaction ?? 0,
          summaryBaseCurrency
        )}. Splitting larger purchases could help track spending better.`,
      });
    }

    if (monthly.length >= 2) {
      const trendUp = monthly[monthly.length - 1]?.total > monthly[monthly.length - 2]?.total;
      nextAlerts.push({
        icon: trendUp ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
        bg: trendUp ? "var(--color-danger-soft)" : "var(--color-success-soft)",
        color: trendUp ? "var(--color-danger)" : "var(--color-success)",
        title: trendUp ? "Upward Spending Trend" : "Spending is Decreasing",
        desc: trendUp
          ? "Your monthly spending has been increasing. Setting a budget could help."
          : "Your monthly spending is trending downward. You're on the right track!",
      });
    }

    return nextAlerts;
  }, [
    categoryDistributionBaseCurrency,
    categoryMap,
    change,
    convertAndFormat,
    monthly,
    sortedCategories,
    summary?.avg_per_transaction,
    summaryBaseCurrency,
  ]);
  const savingsOpportunities = useMemo(
    () =>
      sortedCategories.slice(0, 3).map((item) => ({
        name: categoryMap.get(item.category_id)?.name ?? "Unknown",
        color: categoryMap.get(item.category_id)?.color ?? "var(--color-muted)",
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
              type="button"
              aria-pressed={mode === "rule"}
            >
              <Cpu size={14} />
              Rule-based
            </button>
            <button
              className={`insight-mode-btn ${mode === "ai" ? "active" : ""}`}
              onClick={() => handleModeChange("ai")}
              id="mode-ai"
              type="button"
              aria-pressed={mode === "ai"}
            >
              <Sparkles size={14} />
              AI-Powered
            </button>
          </div>
        }
      />

      <PageFeedback errorMessages={pageErrors} />

      <div className="insights-grid animate-in animate-in-delay-1">
        <SpendingHealthScore score={healthScore} label={healthLabel} />

        <PanelCard>
          <SectionHeader
            icon={<PiggyBank size={20} />}
            iconClassName="metric-icon-success"
            title="Savings Opportunities"
            description="Reduce top categories by 10%"
          />
          {savingsOpportunities.length === 0 ? (
            <p className="muted-copy">Add expenses to see savings opportunities</p>
          ) : (
            savingsOpportunities.map((opportunity) => (
              <div key={opportunity.name} className="savings-item">
                <div className="label-stack">
                  <strong>{opportunity.name}</strong>
                  <span>{opportunity.percentage}%</span>
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
                <div className="progress-card-percent amount-positive">
                  <ArrowDown size={12} />{" "}
                  {convertAndFormat(opportunity.potential, categoryDistributionBaseCurrency)}
                </div>
              </div>
            ))
          )}
        </PanelCard>
      </div>

      <div className="animate-in animate-in-delay-2 section-heading-tight">
        <h3 className="section-heading">Smart Alerts</h3>
        <div className="progress-list">
          {alerts.length === 0 ? (
            <div className="smart-alert">
              <div
                className="alert-icon"
                style={{
                  background: "var(--color-info-soft)",
                  color: "var(--color-info)",
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
          <StateSurface type="loading" framed lines={4} />
        ) : error ? (
          <StateSurface
            type="error"
            framed
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
        ) : (
          <PanelCard className="insight-surface">
            <div
              className="insight-surface-accent"
              style={{
                background: mode === "ai" ? "var(--gradient-primary)" : "var(--gradient-accent)",
              }}
            />
            <SectionHeader
              className="section-heading-row-loose"
              icon={mode === "ai" ? <Sparkles size={22} /> : <Lightbulb size={22} />}
              iconClassName={mode === "ai" ? "metric-icon-cyan" : "metric-icon"}
              title={mode === "ai" ? "AI-Powered Insights" : "Financial Insights"}
              description={
                insight?.provider === "gemini"
                  ? "Powered by Google Gemini"
                  : "Rule-based analysis"
              }
            />
            {insight?.insight ? (
              <div className="insight-card insight-card-shell">{insight.insight}</div>
            ) : (
              <StateSurface
                type="empty"
                title="No insights available yet"
                description="Add some expenses to generate more useful recommendations."
                icon="?"
                compact
              />
            )}
            {mode === "ai" ? (
              <button
                className="btn btn-secondary mt-lg"
                onClick={() => {
                  setLoading(true);
                  void fetchInsights("ai");
                }}
                id="regenerate-insights"
                type="button"
              >
                <Sparkles size={16} /> Regenerate
              </button>
            ) : null}
          </PanelCard>
        )}
      </div>
    </AppShell>
  );
}
