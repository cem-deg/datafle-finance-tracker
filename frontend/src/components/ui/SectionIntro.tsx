"use client";

import type { ReactNode } from "react";

interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionIntro({
  eyebrow,
  title,
  description,
  action,
  className = "",
}: SectionIntroProps) {
  return (
    <div className={`section-intro ${className}`.trim()}>
      <div className="section-intro-copy">
        {eyebrow ? <div className="section-intro-eyebrow">{eyebrow}</div> : null}
        <h2 className="section-intro-title">{title}</h2>
        {description ? <p className="section-intro-description">{description}</p> : null}
      </div>
      {action ? <div className="section-intro-action">{action}</div> : null}
    </div>
  );
}
