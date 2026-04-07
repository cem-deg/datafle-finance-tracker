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
  title?: string;
  periodLabel?: string;
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

function MonthlyBarChart({
  data,
  title = "Monthly Spending",
  periodLabel,
}: Props) {
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
        <div className="card-heading">
          <h3 className="card-title">{title}</h3>
          {periodLabel ? <p className="card-subtitle">{periodLabel}</p> : null}
        </div>
      </div>
      <div ref={containerRef} className="chart-container chart-container-dynamic">
        {chartSize.width > 0 && chartSize.height > 0 ? (
          <BarChart width={chartSize.width} height={chartSize.height} data={chartData} barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => convertAndFormat(v, "USD")} />
            <Tooltip content={<CustomTooltip convertAndFormat={convertAndFormat} baseCurrency="USD" />} cursor={{ fill: "var(--chart-cursor)" }} />
            <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" />
                <stop offset="100%" stopColor="var(--color-primary-hover)" />
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
