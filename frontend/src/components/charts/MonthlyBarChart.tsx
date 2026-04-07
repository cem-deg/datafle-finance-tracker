"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { getMonthName } from "@/utils/formatters";
import { useCurrency } from "@/context/CurrencyContext";
import type { MonthlyTotal } from "@/types";

interface Props {
  data: MonthlyTotal[];
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
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--glass-border)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      fontSize: "var(--font-sm)",
    }}>
      <p style={{ color: "var(--text-secondary)", marginBottom: 4 }}>{label}</p>
      <p style={{ fontWeight: 700 }}>{formatted}</p>
    </div>
  );
}

function MonthlyBarChart({ data }: Props) {
  const { convertAndFormat } = useCurrency();
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, name: getMonthName(d.month) })),
    [data]
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setChartSize({
        width: Math.max(0, Math.floor(rect.width)),
        height: Math.max(0, Math.floor(rect.height)),
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Monthly Spending</h3>
      </div>
      <div ref={containerRef} className="chart-container" style={{ minWidth: 0, minHeight: 280 }}>
        {chartSize.width > 0 && chartSize.height > 0 ? (
          <BarChart width={chartSize.width} height={chartSize.height} data={chartData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" tick={{ fill: "#8888a0", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#8888a0", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => convertAndFormat(v, "USD")} />
            <Tooltip content={<CustomTooltip convertAndFormat={convertAndFormat} baseCurrency="USD" />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c6aef" />
                <stop offset="100%" stopColor="#5a4fcf" />
              </linearGradient>
            </defs>
          </BarChart>
        ) : (
          <div className="skeleton" style={{ height: "100%" }} />
        )}
      </div>
    </div>
  );
}

export default memo(MonthlyBarChart);
