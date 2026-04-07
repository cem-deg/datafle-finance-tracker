"use client";

import { memo, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area,
} from "recharts";
import { formatDateShort } from "@/utils/formatters";
import { useCurrency } from "@/context/CurrencyContext";
import type { DailyTrend } from "@/types";

interface Props {
  data: DailyTrend[];
}

function CustomTooltip({
  active,
  payload,
  label,
  convertAndFormat,
  baseCurrency,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  convertAndFormat?: (amount: number, from: string) => string;
  baseCurrency: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const formatted = convertAndFormat ? convertAndFormat(value, baseCurrency) : `${value.toLocaleString()}`;
  
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">{formatted}</p>
    </div>
  );
}

function TrendLineChart({ data }: Props) {
  const { convertAndFormat } = useCurrency();
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        name: formatDateShort(d.date),
      })),
    [data]
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Spending Trend</h3>
        <span className="badge badge-primary">Last 30 days</span>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => convertAndFormat(v, "USD")} />
            <Tooltip content={<CustomTooltip convertAndFormat={convertAndFormat} baseCurrency="USD" />} />
            <Area type="monotone" dataKey="total" fill="url(#lineGradient)" stroke="none" />
            <Line type="monotone" dataKey="total" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "var(--chart-2)", stroke: "var(--bg-primary)", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(TrendLineChart);
