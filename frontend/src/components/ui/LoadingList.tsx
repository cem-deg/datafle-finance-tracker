"use client";

interface LoadingListProps {
  count?: number;
  height?: number;
  className?: string;
}

export default function LoadingList({
  count = 4,
  height = 60,
  className = "",
}: LoadingListProps) {
  return (
    <div className="loading-list" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${className}`.trim()}
          style={{ height }}
        />
      ))}
    </div>
  );
}
