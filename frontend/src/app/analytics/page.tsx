"use client";

import { BrainCircuit, Target, TrendingDown, TrendingUp } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import StatCard from "@/components/ui/StatCard";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
import StateSurface from "@/components/ui/StateSurface";
import {
  useCategoryDistribution,
  useCategories,
  useMonthlyTotals,
  usePrediction,
  useTrends,
} from "@/hooks/useData";
import { useCurrency } from "@/context/CurrencyContext";

export default function AnalyticsPage() {
  const {
    data: monthly,
    loading: monthlyLoading,
    error: monthlyError,
    refetch: refetchMonthly,
  } = useMonthlyTotals(12);
  const { data: categoryDistribution, loading: categoryLoading, error: categoryError } =
    useCategoryDistribution();
  const { data: trends, loading: trendsLoading, error: trendsError } = useTrends(30);
  const { categories, error: categoriesError } = useCategories();
  const { prediction, loading: predictionLoading, error: predictionError } = usePrediction();
  const { convertAndFormat } = useCurrency();

  const pageErrors = [
    predictionError,
    monthlyError,
    categoryError,
    categoriesError,
    trendsError,
  ].filter(Boolean) as string[];

  return (
    <AppShell>
      <PageHeader title="Analytics" description="Deep dive into your spending patterns" />

      <PageFeedback errorMessages={pageErrors} />

      <div
        className="stat-grid"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
      >
        <StatCard
          className="animate-in animate-in-delay-1"
          icon={<BrainCircuit size={22} />}
          iconClassName="metric-icon"
          label={prediction?.prediction != null ? "Predicted next month" : prediction?.message || "Add expenses to get predictions"}
          loading={predictionLoading}
          value={
            prediction?.prediction != null
              ? convertAndFormat(prediction.prediction, "USD")
              : "Need more data"
          }
          valueClassName={prediction?.prediction != null ? "" : "stat-value-compact"}
          meta={
            prediction?.prediction != null ? (
              <div
                className={`stat-change ${
                  prediction.trend === "increasing" ? "negative" : "positive"
                }`}
              >
                {prediction.trend === "increasing" ? (
                  <TrendingUp size={14} />
                ) : (
                  <TrendingDown size={14} />
                )}
                {prediction.trend ?? "stable"} | {prediction.confidence} confidence
              </div>
            ) : undefined
          }
        />

        <StatCard
          className="animate-in animate-in-delay-2"
          icon={<Target size={22} />}
          iconClassName="metric-icon-cyan"
          label="Months of data"
          loading={predictionLoading}
          value={prediction?.data_points ?? 0}
          meta={<div className="badge badge-primary mt-sm">R2 = {prediction?.r_squared?.toFixed(3) ?? "-"}</div>}
        />
      </div>

      <div className="charts-grid animate-in animate-in-delay-2">
        {monthlyLoading ? (
          <StateSurface type="loading" framed className="animate-in" />
        ) : monthlyError ? (
          <StateSurface
            type="error"
            framed
            title="Monthly totals unavailable"
            description="Try reloading the analytics page."
            actionLabel="Retry"
            onAction={() => void refetchMonthly()}
            icon="!"
            compact
          />
        ) : monthly.length === 0 ? (
          <StateSurface
            type="empty"
            framed
            title="No monthly totals yet"
            description="Add a few transactions to start seeing your spending trend."
            icon="~"
            compact
          />
        ) : (
          <MonthlyBarChart data={monthly} />
        )}

        {categoryLoading ? (
          <StateSurface type="loading" framed />
        ) : categoryError || categoriesError ? (
          <StateSurface
            type="error"
            framed
            title="Category analytics unavailable"
            description="Category data could not be loaded right now."
            icon="!"
            compact
          />
        ) : categoryDistribution.length === 0 ? (
          <StateSurface
            type="empty"
            framed
            title="No category breakdown yet"
            description="Once spending is categorized, the distribution will show up here."
            icon="%"
            compact
          />
        ) : (
          <CategoryPieChart data={categoryDistribution} categories={categories} />
        )}
      </div>

      <div className="animate-in animate-in-delay-3">
        {trendsLoading ? (
          <StateSurface type="loading" framed />
        ) : trendsError ? (
          <StateSurface
            type="error"
            framed
            title="Trend chart unavailable"
            description="Trend data could not be loaded right now."
            icon="!"
            compact
          />
        ) : trends.length === 0 ? (
          <StateSurface
            type="empty"
            framed
            title="No trend data yet"
            description="Recent daily activity will appear here once you have more entries."
            icon="/"
            compact
          />
        ) : (
          <TrendLineChart data={trends} />
        )}
      </div>
    </AppShell>
  );
}
