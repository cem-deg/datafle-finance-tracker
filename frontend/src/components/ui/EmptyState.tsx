"use client";

import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  compact?: boolean;
  note?: string;
  tone?: "default" | "error";
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "*",
  compact = false,
  note,
  tone = "default",
}: EmptyStateProps) {
  const emptyStateClassName = [
    styles.emptyState,
    tone === "error" ? styles.error : "",
    compact ? styles.compact : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={emptyStateClassName}>
      <div className={styles.emptyIcon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {note ? <div className={styles.note}>{note}</div> : null}
      {actionLabel && onAction ? (
        <button className={`btn btn-primary ${styles.action}`} onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
