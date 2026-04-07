"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ModalShell({ title, onClose, children }: ModalShellProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="modal-title">{title}</h2>
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
