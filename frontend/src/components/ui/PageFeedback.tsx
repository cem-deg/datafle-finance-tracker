"use client";

import InlineMessage from "@/components/ui/InlineMessage";

interface PageFeedbackProps {
  successMessage?: string | null;
  errorMessages?: Array<string | null | undefined>;
  onDismissSuccess?: () => void;
}

export default function PageFeedback({
  successMessage,
  errorMessages = [],
  onDismissSuccess,
}: PageFeedbackProps) {
  const filteredErrors = errorMessages.filter(Boolean) as string[];

  if (!successMessage && filteredErrors.length === 0) {
    return null;
  }

  return (
    <div className="page-feedback">
      {successMessage ? (
        <InlineMessage
          message={successMessage}
          tone="success"
          onDismiss={onDismissSuccess}
        />
      ) : null}
      {filteredErrors.map((message) => (
        <InlineMessage key={message} message={message} />
      ))}
    </div>
  );
}
