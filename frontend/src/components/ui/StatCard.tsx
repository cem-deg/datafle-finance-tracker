"use client";

import type { CSSProperties, ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  meta?: ReactNode;
  loading?: boolean;
  className?: string;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  valueClassName?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  meta,
  loading = false,
  className = "",
  iconClassName = "",
  iconStyle,
  valueClassName = "",
}: StatCardProps) {
  return (
    <div className={`stat-card ${className}`.trim()}>
      <div className={`stat-icon ${iconClassName}`.trim()} style={iconStyle}>
        {icon}
      </div>
      {loading ? (
        <div className="skeleton skeleton-heading" />
      ) : (
        <>
          <div className={`stat-value ${valueClassName}`.trim()}>{value}</div>
          <div className="stat-label">{label}</div>
          {meta ? meta : null}
        </>
      )}
    </div>
  );
}
