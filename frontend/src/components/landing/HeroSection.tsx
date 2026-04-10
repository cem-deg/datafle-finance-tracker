"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChartSpline,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { PhoneActivityItem } from "./content";
import HeroDashboardMockup from "./HeroDashboardMockup";
import HeroPhoneMockup from "./HeroPhoneMockup";
import styles from "./LandingPage.module.css";

interface HeroSectionProps {
  heroParallax: number;
  phoneActivity: PhoneActivityItem[];
}

export default function HeroSection({ heroParallax, phoneActivity }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsVisible(true), 120);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackdrop} />
      <div className={`${styles.heroOrb} ${styles.orbOne}`} />
      <div className={`${styles.heroOrb} ${styles.orbTwo}`} />
      <div className={`${styles.heroOrb} ${styles.orbThree}`} />

      <div className={styles.heroGrid}>
        <div
          className={`${styles.heroCopy} ${isVisible ? styles.heroRevealed : ""}`}
          style={{ transform: `translate3d(0, ${heroParallax * -0.1 + (isVisible ? 0 : 26)}px, 0)` }}
        >
          <div className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowIcon}>
              <Sparkles size={14} strokeWidth={2.2} />
            </span>
            Financial clarity for modern personal finance
          </div>

          <h1 className={styles.heroTitle}>
            See your money with <span>more control and less noise.</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Track balances, budgets, spending pressure, and trends in one calm financial workspace.
          </p>

          <div className={styles.heroActions}>
            <Link href="/register" className="btn btn-primary">
              Get Started <ArrowRight size={18} />
            </Link>
            <Link href="/login" className={`btn btn-secondary ${styles.heroSecondary}`}>
              Explore the product
            </Link>
          </div>

          <div className={styles.heroTrustRow}>
            <div className={styles.heroTrustItem}>
              <ShieldCheck size={15} />
              Private by design
            </div>
            <div className={styles.heroTrustItem}>
              <ChartSpline size={15} />
              Live dashboards
            </div>
            <div className={styles.heroTrustText}>Built for daily financial awareness.</div>
          </div>
        </div>

        <div
          className={`${styles.heroShowcase} ${isVisible ? styles.heroRevealed : ""}`}
        >
          <div className={styles.heroMockupScene}>
            <HeroDashboardMockup />
            <HeroPhoneMockup phoneActivity={phoneActivity} />
          </div>
        </div>
      </div>
    </section >
  );
}
