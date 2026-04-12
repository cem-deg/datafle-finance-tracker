"use client";

import { Signal, Wifi } from "lucide-react";

import type { PhoneActivityItem } from "./content";
import styles from "./HeroPhoneMockup.module.css";

interface HeroPhoneMockupProps {
  phoneActivity: PhoneActivityItem[];
}

export default function HeroPhoneMockup({ phoneActivity }: HeroPhoneMockupProps) {
  return (
    <div className={styles.heroPhoneMockup} aria-hidden="true">
      <div className={styles.heroPhoneSideButton} />
      <div className={`${styles.heroPhoneSideButton} ${styles.heroPhoneSideButtonLower}`} />

      <div className={styles.heroPhoneFrame}>
        <div className={styles.heroPhoneNotch} />

        <div className={styles.heroPhoneScreen}>
          <div className={styles.heroPhoneStatusBar}>
            <span>9:41</span>
            <div className={styles.heroPhoneStatusIcons}>
              <Signal size={12} strokeWidth={2.2} />
              <Wifi size={12} strokeWidth={2.2} />
              <span className={styles.heroPhoneBattery}>
                <span />
              </span>
            </div>
          </div>

          <section className={styles.heroPhoneBalanceCard}>
            <span>Available balance</span>
            <strong>$4,820</strong>
            <p>Healthy runway for the rest of April</p>
          </section>

          <section className={styles.heroPhoneCompactStats}>
            <div className={styles.heroPhoneMiniCard}>
              <span>Income</span>
              <strong>$6,300</strong>
            </div>
            <div className={styles.heroPhoneMiniCard}>
              <span>Spent</span>
              <strong>$1,480</strong>
            </div>
          </section>

          <section className={styles.heroPhoneChartCard}>
            <div className={styles.heroPhoneCardHeader}>
              <div>
                <span>Budget forecast</span>
                <strong>Controlled trajectory</strong>
              </div>
              <div className={styles.heroPhoneLiveBadge}>Live</div>
            </div>

            <div className={styles.heroPhoneChart}>
              <div className={`${styles.heroPhoneChartLine} ${styles.heroPhoneChartLineOne}`} />
              <div className={`${styles.heroPhoneChartLine} ${styles.heroPhoneChartLineTwo}`} />
            </div>
          </section>

          <div className={styles.heroPhoneTabBar}>
            <span className={styles.heroPhoneTabActive}>Overview</span>
            <span>Budgets</span>
            <span>Insights</span>
          </div>
        </div>
      </div>
    </div>
  );
}
