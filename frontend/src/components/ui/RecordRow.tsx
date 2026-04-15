"use client";

import type { ReactNode } from "react";
import styles from "./RecordRow.module.css";

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
    <div className={`${styles.recordRow} expense-item ${className}`.trim()}>
      {leading}
      <div className={`${styles.expenseInfo} expense-info`}>
        <div className={`${styles.expenseDesc} expense-desc`}>{title}</div>
        <div className={`${styles.expenseMeta} expense-meta`}>{meta}</div>
      </div>
      <div className={`${styles.expenseAmount} expense-amount ${amountClassName}`.trim()}>{amount}</div>
      {actions ? <div className={`${styles.expenseActions} expense-actions`}>{actions}</div> : null}
    </div>
  );
}
