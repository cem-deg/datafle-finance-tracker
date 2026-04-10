import Link from "next/link";
import {
  CheckCircle2,
  Gauge,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "./ScrollReveal";
import LandingHowItWorksSection from "./LandingHowItWorksSection";
import LandingProductSpotlightSection from "./LandingProductSpotlightSection";
import type { TrustStripItem } from "./content";
import LandingValueShowcaseSection from "./LandingValueShowcaseSection";
import styles from "./LandingPage.module.css";

interface LandingSectionsProps {
  mockupParallax?: number;
  trustStripItems: TrustStripItem[];
}

export default function LandingSections({
  mockupParallax = 0,
  trustStripItems,
}: LandingSectionsProps) {
  const trustStripIcons = {
    overview: LayoutDashboard,
    budget: Gauge,
    clarity: Sparkles,
  } as const;

  return (
    <>
      <section className={styles.trustStripSection} aria-label="Product value summary">
        <ScrollReveal>
          <div className={styles.trustStripShell}>
            {trustStripItems.map((item) => {
              const Icon = trustStripIcons[item.icon];

              return (
                <article key={item.title} className={styles.trustStripItem}>
                  <span className={styles.trustStripIcon} aria-hidden="true">
                    <Icon size={17} strokeWidth={2.1} />
                  </span>
                  <div className={styles.trustStripCopy}>
                    <h3 className={styles.trustStripTitle}>{item.title}</h3>
                    <p className={styles.trustStripText}>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      <LandingValueShowcaseSection />
      <LandingHowItWorksSection />

      <LandingProductSpotlightSection mockupParallax={mockupParallax} />

      <section className="features-section" id="pricing">
        <ScrollReveal>
          <div className="section-header">
            <h2>Start without friction</h2>
            <p>Core tracking, budgets, analytics, and insights are available from day one.</p>
          </div>
          <div className="feature-card landing-plan-card">
            <h3>Free plan</h3>
            <p>Track expenses and income, manage budgets, and view analytics and insights with no paywall.</p>
            <p className="mt-md">
              <CheckCircle2 size={16} /> Unlimited entries and categories
            </p>
            <p className="mt-sm">
              <CheckCircle2 size={16} /> Budget and dashboard modules included
            </p>
            <p className="mt-sm">
              <CheckCircle2 size={16} /> Rule-based and AI insight modes
            </p>
            <div className="hero-actions mt-lg">
              <Link href="/register" className="btn btn-primary">
                Create account
              </Link>
              <Link href="/login" className="btn btn-secondary">
                Sign in
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="landing-footer">
        <ScrollReveal>
          <p>&copy; {new Date().getFullYear()} Datafle. Precision, polish, and control for modern personal finance.</p>
        </ScrollReveal>
      </footer>
    </>
  );
}
