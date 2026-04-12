"use client";

import { TrendingUp } from "lucide-react";

import styles from "./HeroDashboardMockup.module.css";

export default function HeroDashboardMockup() {
  return (
    <div className={styles.heroDashboardMockup} aria-hidden="true">
      <div className={styles.heroDashboardChrome}>
        <span />
        <span />
        <span />
      </div>

      <div className={styles.heroDashboardHeader}>
        <div>
          <div className={styles.heroDashboardLabel}>Portfolio overview</div>
          <h3>Financial command center</h3>
        </div>
        <div className={styles.heroDashboardStatus}>
          <TrendingUp size={14} />
          14% healthier cashflow
        </div>
      </div>

      <div className={styles.heroDashboardMetrics}>
        <div className={styles.heroDashboardMetricCard}>
          <span>Money spent</span>
          <strong>$1,480</strong>
          <small>Tracked against planned monthly spending</small>
        </div>
        <div className={styles.heroDashboardMetricCard}>
          <span>Savings</span>
          <strong>$22,180</strong>
          <small>Emergency fund and short-term goals combined</small>
        </div>
        <div className={styles.heroDashboardMetricCard}>
          <span>Monthly budget</span>
          <strong>$3,600</strong>
          <small>Calm spending limit across core categories</small>
        </div>
      </div>

      <div className={styles.heroDashboardBody}>
        <aside className={styles.heroDashboardSidebarRail}>
          <section className={styles.heroDashboardGlassColumn}>
            <div className={styles.heroDashboardGlassSurface} />
            <div className={styles.heroDashboardGlassSurface} />
            <div className={`${styles.heroDashboardGlassSurface} ${styles.heroDashboardGlassSurfaceTall}`} />
            <div className={styles.heroDashboardGlassSurface} />
            <div className={styles.heroDashboardGlassSurface} />
          </section>
        </aside>

        <section className={styles.heroDashboardPrimary}>
          <div className={styles.heroDashboardSectionHeader}>
            <div>
              <span>Cashflow rhythm</span>
              <strong>Readable weekly movement</strong>
            </div>
            <div className={styles.heroDashboardPill}>Live</div>
          </div>

          <div className={styles.heroDashboardChart}>
            <div className={`${styles.heroDashboardChartLine} ${styles.heroDashboardChartLineOne}`} />
            <div className={`${styles.heroDashboardChartLine} ${styles.heroDashboardChartLineTwo}`} />
            <div className={`${styles.heroDashboardChartLine} ${styles.heroDashboardChartLineThree}`} />
          </div>

          <div className={styles.heroDashboardSummaryRow}>
            <div className={styles.heroDashboardSummaryCard}>
              <span>Checking</span>
              <strong>$8,420</strong>
            </div>
            <div className={styles.heroDashboardSummaryCard}>
              <span>Savings</span>
              <strong>$22,180</strong>
            </div>
            <div className={styles.heroDashboardSummaryCard}>
              <span>Investments</span>
              <strong>$97,800</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
