"use client";

import type { ReactNode } from "react";
import styles from "./SectionIntro.module.css";

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
  const rootClassName = [styles.sectionIntro, "section-intro", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <div className={styles.copy}>
        {eyebrow ? <div className={styles.eyebrow}>{eyebrow}</div> : null}
        <h2 className={`${styles.title} section-intro-title`}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
