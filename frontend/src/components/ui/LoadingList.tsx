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
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`skeleton ${className}`.trim()}
          style={{ height, marginBottom: 8 }}
        />
      ))}
    </>
  );
}
