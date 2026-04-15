"use client";

import type { ReactNode } from "react";
import styles from "./PanelCard.module.css";

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
    <div className={`${styles.panelCard} card ${className}`.trim()}>
      {title || action ? (
        <div className={`${styles.cardHeader} card-header`}>
          {title ? (
            <div className={`${styles.cardHeading} card-heading`}>
              <h3 className={`${styles.cardTitle} card-title`}>{title}</h3>
              {subtitle ? <p className={`${styles.cardSubtitle} card-subtitle`}>{subtitle}</p> : null}
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
