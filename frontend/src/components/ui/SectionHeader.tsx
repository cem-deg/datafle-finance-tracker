"use client";

import type { ReactNode } from "react";

interface SectionHeaderProps {
  icon: ReactNode;
  title: string;
  description?: string;
  iconClassName?: string;
  className?: string;
}

export default function SectionHeader({
  icon,
  title,
  description,
  iconClassName = "",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`section-heading-row ${className}`.trim()}>
      <div className={`section-heading-icon ${iconClassName}`.trim()}>{icon}</div>
      <div className="section-heading-copy">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
