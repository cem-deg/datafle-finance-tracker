"use client";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, index) => index + 1);

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        &larr;
      </button>
      {pages.map((value) => (
        <button
          key={value}
          className={`pagination-btn ${page === value ? "active" : ""}`}
          onClick={() => onPageChange(value)}
          aria-current={page === value ? "page" : undefined}
        >
          {value}
        </button>
      ))}
      <button
        className="pagination-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        &rarr;
      </button>
    </div>
  );
}
