"use client";

import { ReactNode } from "react";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className={`${styles.pageHeader} page-header animate-in`}>
      <div className={`${styles.pageHeaderContent} page-header-content`}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className={`${styles.pageHeaderActions} page-header-actions`}>{actions}</div> : null}
    </div>
  );
}
