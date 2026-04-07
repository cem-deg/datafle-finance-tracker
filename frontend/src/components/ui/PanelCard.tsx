"use client";

import type { ReactNode } from "react";

interface PanelCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function PanelCard({
  children,
  title,
  subtitle,
  action,
  className = "",
  bodyClassName,
}: PanelCardProps) {
  return (
    <div className={`card ${className}`.trim()}>
      {title || action ? (
        <div className="card-header">
          {title ? (
            <div className="card-heading">
              <h3 className="card-title">{title}</h3>
              {subtitle ? <p className="card-subtitle">{subtitle}</p> : null}
            </div>
          ) : (
            <div />
          )}
          {action ? action : null}
        </div>
      ) : null}
      {bodyClassName ? <div className={bodyClassName}>{children}</div> : children}
    </div>
  );
}
