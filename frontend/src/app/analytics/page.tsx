"use client";

import { BrainCircuit, Target, TrendingDown, TrendingUp } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import MonthlyBarChart from "@/components/charts/MonthlyBarChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import EmptyState from "@/components/ui/EmptyState";
import PageFeedback from "@/components/ui/PageFeedback";
import PageHeader from "@/components/ui/PageHeader";
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
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          marginBottom: "var(--space-xl)",
        }}
      >
        <div className="stat-card animate-in animate-in-delay-1">
          <div
            className="stat-icon"
            style={{
              background: "rgba(124,106,239,0.15)",
              color: "var(--accent-primary-light)",
            }}
          >
            <BrainCircuit size={22} />
          </div>
          {predictionLoading ? (
            <div className="skeleton skeleton-heading" />
          ) : prediction?.prediction != null ? (
            <>
              <div className="stat-value">
                {convertAndFormat(prediction.prediction, "USD")}
              </div>
              <div className="stat-label">Predicted next month</div>
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
            </>
          ) : (
            <>
              <div className="stat-value" style={{ fontSize: "var(--font-lg)" }}>
                Need more data
              </div>
              <div className="stat-label">
                {prediction?.message || "Add expenses to get predictions"}
              </div>
            </>
          )}
        </div>

        <div className="stat-card animate-in animate-in-delay-2">
          <div
            className="stat-icon"
            style={{ background: "rgba(0,210,211,0.15)", color: "var(--accent-secondary)" }}
          >
            <Target size={22} />
          </div>
          {predictionLoading ? (
            <div className="skeleton skeleton-heading" />
          ) : (
            <>
              <div className="stat-value">{prediction?.data_points ?? 0}</div>
              <div className="stat-label">Months of data</div>
              <div className="badge badge-primary" style={{ marginTop: 8 }}>
                R2 = {prediction?.r_squared?.toFixed(3) ?? "-"}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="charts-grid animate-in animate-in-delay-2">
        {monthlyLoading ? (
          <div className="card">
            <div className="skeleton" style={{ height: 300 }} />
          </div>
        ) : monthlyError ? (
          <div className="card">
            <EmptyState
              title="Monthly totals unavailable"
              description="Try reloading the analytics page."
              actionLabel="Retry"
              onAction={() => void refetchMonthly()}
              icon="!"
              compact
            />
          </div>
        ) : (
          <MonthlyBarChart data={monthly} />
        )}

        {categoryLoading ? (
          <div className="card">
            <div className="skeleton" style={{ height: 300 }} />
          </div>
        ) : categoryError || categoriesError ? (
          <div className="card">
            <EmptyState
              title="Category analytics unavailable"
              description="Category data could not be loaded right now."
              icon="!"
              compact
            />
          </div>
        ) : (
          <CategoryPieChart data={categoryDistribution} categories={categories} />
        )}
      </div>

      <div className="animate-in animate-in-delay-3">
        {trendsLoading ? (
          <div className="card">
            <div className="skeleton" style={{ height: 300 }} />
          </div>
        ) : trendsError ? (
          <div className="card">
            <EmptyState
              title="Trend chart unavailable"
              description="Trend data could not be loaded right now."
              icon="!"
              compact
            />
          </div>
        ) : (
          <TrendLineChart data={trends} />
        )}
      </div>
    </AppShell>
  );
}
