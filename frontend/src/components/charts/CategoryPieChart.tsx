"use client";

import { memo, useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { useCurrency } from "@/context/CurrencyContext";
import { CATEGORY_COLORS } from "@/utils/constants";
import type { CategoryDistribution, Category } from "@/types";

interface Props {
  data: CategoryDistribution[];
  categories: Category[];
  baseCurrency: string;
}

const FALLBACK_COLORS = CATEGORY_COLORS;

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
    <div className="chart-tooltip">
      <p className="chart-tooltip-value" style={{ marginBottom: 4 }}>{item.name}</p>
      <p>{formatted} ({item.payload.percentage}%)</p>
    </div>
  );
}

function CategoryPieChart({ data, categories, baseCurrency }: Props) {
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
      <div className="chart-container chart-layout">
        <div className="chart-main">
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
              <Tooltip content={<CustomTooltip convertAndFormat={convertAndFormat} baseCurrency={baseCurrency} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-sidebar">
          {chartData.slice(0, 6).map((entry, i) => (
            <div key={i} className="chart-legend-item">
              <div className="chart-legend-dot" style={{ background: entry.color }} />
              <span className="chart-legend-label">{entry.name}</span>
              <span className="chart-legend-value">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(CategoryPieChart);
