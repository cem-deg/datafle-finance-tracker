"use client";

import type { ReactNode } from "react";

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  help?: ReactNode;
  helpId?: string;
  children: ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  help,
  helpId,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={`form-group ${className}`.trim()}>
      {label ? (
        <label className="form-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : null}
      {children}
      {help ? (
        <span className="form-help" id={helpId}>
          {help}
        </span>
      ) : null}
    </div>
  );
}
