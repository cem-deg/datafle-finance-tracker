"use client";

import { ReactNode, useEffect, useId, useRef } from "react";
import styles from "./ModalShell.module.css";
import { X } from "lucide-react";

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalShell({ title, onClose, children }: ModalShellProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className={`${styles.modalOverlay} modal-overlay`} onClick={onClose}>
      <div
        className={`${styles.modalShell} modal`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className={`${styles.modalHeader} modal-header`}>
          <h2 className={`${styles.modalTitle} modal-title`} id={titleId}>
            {title}
          </h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            type="button"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
