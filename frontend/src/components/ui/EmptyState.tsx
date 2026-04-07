"use client";

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
  return (
    <div
      className={`empty-state empty-state-${tone} ${
        compact ? "empty-state-compact" : ""
      }`.trim()}
    >
      <div className="empty-icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {note ? <div className="empty-note">{note}</div> : null}
      {actionLabel && onAction ? (
        <button className="btn btn-primary" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
