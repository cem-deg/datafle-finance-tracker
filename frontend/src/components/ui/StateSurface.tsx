"use client";

import EmptyState from "@/components/ui/EmptyState";

interface StateSurfaceProps {
  type: "loading" | "empty" | "error";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
  compact?: boolean;
  framed?: boolean;
  className?: string;
  lines?: number;
}

export default function StateSurface({
  type,
  title,
  description,
  actionLabel,
  onAction,
  icon,
  compact = false,
  framed = false,
  className = "",
  lines = 3,
}: StateSurfaceProps) {
  const shellClassName = `${framed ? "card " : ""}state-surface ${className}`.trim();

  if (type === "loading") {
    return (
      <div className={shellClassName} aria-busy="true" aria-live="polite">
        <div className="state-loading">
          <div className="skeleton skeleton-heading state-loading-heading" />
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`skeleton skeleton-text state-loading-line ${
                index === lines - 1 ? "state-loading-line-short" : ""
              }`.trim()}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={shellClassName}>
      <EmptyState
        title={title || (type === "error" ? "Something went wrong" : "Nothing to show yet")}
        description={
          description ||
          (type === "error"
            ? "Try again in a moment."
            : "There is nothing here yet.")
        }
        actionLabel={actionLabel}
        onAction={onAction}
        icon={icon}
        compact={compact}
        tone={type === "error" ? "error" : "default"}
      />
    </div>
  );
}
