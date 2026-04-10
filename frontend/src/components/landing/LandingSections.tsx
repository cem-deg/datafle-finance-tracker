import {
  Gauge,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "./ScrollReveal";
import LandingFooter from "./LandingFooter";
import LandingHowItWorksSection from "./LandingHowItWorksSection";
import LandingPricingTeaserSection from "./LandingPricingTeaserSection";
import type { TrustStripItem } from "./content";
import LandingValueShowcaseSection from "./LandingValueShowcaseSection";
import styles from "./LandingPage.module.css";

interface LandingSectionsProps {
  trustStripItems: TrustStripItem[];
}

export default function LandingSections({
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
      <LandingPricingTeaserSection />
      <LandingFooter />
    </>
  );
}
