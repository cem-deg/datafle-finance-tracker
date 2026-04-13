"use client";

import { ReactNode } from "react";

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
    <div className="progress-list">
      {items.map((item) => (
        <div key={item.budget_id} className="progress-card">
          <div className="progress-card-header">
            <div className="progress-card-label">
              {renderIcon ? renderIcon(item) : null}
              <strong>{item.category_name}</strong>
            </div>
            <span className={`progress-card-percent ${item.is_over_budget ? "is-danger" : ""}`}>
              {item.usage_percent}%
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.min(item.usage_percent, 100)}%`,
                background: item.is_over_budget ? "var(--accent-danger)" : item.category_color,
              }}
            />
          </div>
          <div className="progress-card-meta">{renderMeta(item)}</div>
        </div>
      ))}
    </div>
  );
}
