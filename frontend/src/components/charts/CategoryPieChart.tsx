"use client";

import { memo, useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { useCurrency } from "@/context/CurrencyContext";
import type { CategoryDistribution, Category } from "@/types";

interface Props {
  data: CategoryDistribution[];
  categories: Category[];
}

const FALLBACK_COLORS = [
  "#7c6aef", "#00d2d3", "#ff6b6b", "#feca57", "#a29bfe",
  "#fd79a8", "#00b894", "#e17055", "#636e72", "#74b9ff",
];

function CustomTooltip({
  active,
  payload,
  convertAndFormat,
  baseCurrency,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { percentage: number } }>;
  convertAndFormat?: (amount: number, from: string) => string;
  baseCurrency: string;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const formatted = convertAndFormat ? convertAndFormat(item.value, baseCurrency) : `${item.value.toLocaleString()}`;
  
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--glass-border)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      fontSize: "var(--font-sm)",
    }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</p>
      <p>{formatted} ({item.payload.percentage}%)</p>
    </div>
  );
}

function CategoryPieChart({ data, categories }: Props) {
  const { convertAndFormat } = useCurrency();
  const chartData = useMemo(() => {
    const catMap = new Map(categories.map((category) => [category.id, category]));
    return data.map((entry) => {
      const category = catMap.get(entry.category_id);
      return {
        name: category?.name || "Unknown",
        value: entry.amount,
        percentage: entry.percentage,
        color: category?.color || FALLBACK_COLORS[entry.category_id % FALLBACK_COLORS.length],
      };
    });
  }, [categories, data]);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Category Distribution</h3>
      </div>
      <div className="chart-container" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "55%", height: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip convertAndFormat={convertAndFormat} baseCurrency="USD" />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: "45%", display: "flex", flexDirection: "column", gap: 8 }}>
          {chartData.slice(0, 6).map((entry, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--font-xs)" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: entry.color, flexShrink: 0 }} />
              <span style={{ flex: 1, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.name}</span>
              <span style={{ fontWeight: 600 }}>{entry.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(CategoryPieChart);
