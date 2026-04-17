"use client";

import EmptyState from "@/components/ui/EmptyState";
import styles from "./StateSurface.module.css";

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
  const shellClassName = [framed ? "card" : "", styles.stateSurface, className]
    .filter(Boolean)
    .join(" ");

  if (type === "loading") {
    return (
      <div className={shellClassName} aria-busy="true" aria-live="polite">
        <div className={styles.stateLoading}>
          <div className={`skeleton skeleton-heading ${styles.stateLoadingHeading}`} />
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`skeleton skeleton-text ${styles.stateLoadingLine} ${
                index === lines - 1 ? styles.stateLoadingLineShort : ""
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
