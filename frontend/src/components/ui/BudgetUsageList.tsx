"use client";

import { ReactNode } from "react";
import styles from "./BudgetUsageList.module.css";

interface BudgetUsageItem {
  budget_id: number;
  category_name: string;
  category_color: string;
  base_currency?: string;
  usage_percent: number;
  is_over_budget: boolean;
  spent: number;
  amount: number;
  remaining?: number;
}

interface BudgetUsageListProps {
  items: BudgetUsageItem[];
  renderIcon?: (item: BudgetUsageItem) => ReactNode;
  renderMeta: (item: BudgetUsageItem) => ReactNode;
}

export default function BudgetUsageList({
  items,
  renderIcon,
  renderMeta,
}: BudgetUsageListProps) {
  return (
    <div className={`${styles.list} progress-list`}>
      {items.map((item) => (
        <div key={item.budget_id} className={`${styles.card} progress-card`}>
          <div className={styles.header}>
            <div className={styles.label}>
              {renderIcon ? renderIcon(item) : null}
              <strong>{item.category_name}</strong>
            </div>
            <span className={`${styles.percent} ${item.is_over_budget ? styles.danger : ""}`.trim()}>
              {item.usage_percent}%
            </span>
          </div>
          <div className={styles.track}>
            <div
              className={styles.fill}
              style={{
                width: `${Math.min(item.usage_percent, 100)}%`,
                background: item.is_over_budget ? "var(--accent-danger)" : item.category_color,
              }}
            />
          </div>
          <div className={styles.meta}>{renderMeta(item)}</div>
        </div>
      ))}
    </div>
  );
}
