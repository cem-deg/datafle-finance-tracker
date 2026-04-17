"use client";

import styles from "./PaginationControls.module.css";

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
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        &larr;
      </button>
      {pages.map((value) => (
        <button
          key={value}
          className={`${styles.paginationBtn} ${page === value ? styles.active : ""}`.trim()}
          onClick={() => onPageChange(value)}
          aria-current={page === value ? "page" : undefined}
        >
          {value}
        </button>
      ))}
      <button
        className={styles.paginationBtn}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        &rarr;
      </button>
    </div>
  );
}
