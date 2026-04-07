"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type InlineMessageTone = "error" | "info" | "success";

interface InlineMessageProps {
  message: string;
  tone?: InlineMessageTone;
  className?: string;
  onDismiss?: () => void;
  id?: string;
}

export default function InlineMessage({
  message,
  tone = "error",
  className = "",
  onDismiss,
  id,
}: InlineMessageProps) {
  const icon =
    tone === "success" ? <CheckCircle2 size={16} /> : tone === "info" ? <Info size={16} /> : <AlertCircle size={16} />;

  return (
    <div
      className={`inline-message inline-message-${tone} ${className}`.trim()}
      id={id}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      <div className="inline-message-content">
        <span className="inline-message-icon" aria-hidden="true">
          {icon}
        </span>
        <span>{message}</span>
      </div>
      {onDismiss ? (
        <button
          type="button"
          className="inline-message-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss message"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}
