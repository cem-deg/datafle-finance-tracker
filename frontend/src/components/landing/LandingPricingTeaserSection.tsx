import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import ScrollReveal from "./ScrollReveal";
import styles from "./PricingTeaser.module.css";

type PricingTeaserPlan = {
  name: string;
  description: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
  badge?: string;
};

const PLANS: PricingTeaserPlan[] = [
  {
    name: "Starter",
    description: "A clear starting point for everyday money tracking",
    points: [
      "Track income and expenses",
      "Basic budgeting and dashboard overview",
    ],
    ctaLabel: "Start free",
    ctaHref: "/register",
  },
  {
    name: "Pro",
    description: "A lighter step up for calmer, deeper financial control",
    points: [
      "Smart spending insights",
      "Category pressure and weekly clarity",
    ],
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/register",
    highlighted: true,
    badge: "Most clarity",
  },
];

export default function LandingPricingTeaserSection() {
  return (
    <section
      className={styles.pricingTeaserSection}
      id="pricing"
      aria-labelledby="pricing-teaser-title"
    >
      <div className={styles.pricingTeaserGlow} aria-hidden="true" />

      <ScrollReveal>
        <div className={styles.pricingTeaserInner}>
          <div className={styles.pricingTeaserHeader}>
            <span className={styles.pricingTeaserEyebrow}>Start without friction</span>
            <h2 id="pricing-teaser-title" className={styles.pricingTeaserTitle}>
              Simple to begin. Clear as you grow.
            </h2>
            <p className={styles.pricingTeaserSubtitle}>
              Track your money from day one, and unlock deeper control when you need it.
            </p>
          </div>

          <div className={styles.pricingTeaserGrid}>
            {PLANS.map(({ name, description, points, ctaLabel, ctaHref, highlighted, badge }, index) => (
              <ScrollReveal
                key={name}
                delay={index * 80}
                className={styles.pricingTeaserCardReveal}
              >
                <article
                  className={`${styles.pricingTeaserCard} ${
                    highlighted ? styles.pricingTeaserCardHighlighted : ""
                  }`}
                >
                  {highlighted ? <span className={styles.pricingTeaserCardGlow} aria-hidden="true" /> : null}

                  <div className={styles.pricingTeaserCardHeader}>
                    <div>
                      <h3 className={styles.pricingTeaserCardTitle}>{name}</h3>
                      <p className={styles.pricingTeaserCardText}>{description}</p>
                    </div>
                    {badge ? <span className={styles.pricingTeaserBadge}>{badge}</span> : null}
                  </div>

                  <div className={styles.pricingTeaserFeatureList}>
                    {points.map((point) => (
                      <div key={point} className={styles.pricingTeaserFeature}>
                        <span className={styles.pricingTeaserFeatureIcon} aria-hidden="true">
                          <CheckCircle2 size={15} strokeWidth={2.1} />
                        </span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.pricingTeaserActions}>
                    <Link
                      href={ctaHref}
                      className={`btn btn-sm ${highlighted ? "btn-primary" : "btn-secondary"} ${styles.pricingTeaserButton}`}
                    >
                      {ctaLabel}
                    </Link>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
