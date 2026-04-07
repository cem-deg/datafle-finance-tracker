"use client";

import type { ReactNode } from "react";

interface RecordRowProps {
  leading: ReactNode;
  title: ReactNode;
  meta: ReactNode;
  amount: ReactNode;
  actions?: ReactNode;
  amountClassName?: string;
  className?: string;
}

export default function RecordRow({
  leading,
  title,
  meta,
  amount,
  actions,
  amountClassName = "",
  className = "",
}: RecordRowProps) {
  return (
    <div className={`expense-item ${className}`.trim()}>
      {leading}
      <div className="expense-info">
        <div className="expense-desc">{title}</div>
        <div className="expense-meta">{meta}</div>
      </div>
      <div className={`expense-amount ${amountClassName}`.trim()}>{amount}</div>
      {actions ? <div className="expense-actions">{actions}</div> : null}
    </div>
  );
}
