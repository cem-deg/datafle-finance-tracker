"use client";

import type { ReactNode } from "react";

interface FormActionsProps {
  children: ReactNode;
  className?: string;
}

export default function FormActions({ children, className = "" }: FormActionsProps) {
  return <div className={`form-actions ${className}`.trim()}>{children}</div>;
}
