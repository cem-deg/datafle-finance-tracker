"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "./StatCard.module.css";

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
    <div className={`${styles.statCard} stat-card ${className}`.trim()}>
      <div className={`${styles.statIcon} stat-icon ${iconClassName}`.trim()} style={iconStyle}>
        {icon}
      </div>
      {loading ? (
        <div className="skeleton skeleton-heading" />
      ) : (
        <>
          <div className={`${styles.statValue} stat-value ${valueClassName}`.trim()}>{value}</div>
          <div className={`${styles.statLabel} stat-label`}>{label}</div>
          {meta ? meta : null}
        </>
      )}
    </div>
  );
}
