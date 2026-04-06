import Navbar from "@/components/layout/Navbar";

import HeroSection from "./HeroSection";
import LandingSections from "./LandingSections";
import {
  FEATURE_PANELS,
  PHONE_ACTIVITY,
  PRICING_PLANS,
  READINESS_POINTS,
  SAVINGS_JOURNEY,
  TRUST_METRICS,
  VALUE_POINTS,
  WORKFLOW,
} from "./content";
import styles from "./LandingPage.module.css";

interface LandingPageContentProps {
  heroParallax: number;
  mockupParallax: number;
}

export default function LandingPageContent({ heroParallax, mockupParallax }: LandingPageContentProps) {
  return (
    <div className={styles.page}>
      <Navbar />
      <HeroSection heroParallax={heroParallax} phoneActivity={PHONE_ACTIVITY} />
      <LandingSections
        mockupParallax={mockupParallax}
        trustMetrics={TRUST_METRICS}
        featurePanels={FEATURE_PANELS}
        valuePoints={VALUE_POINTS}
        workflow={WORKFLOW}
        readinessPoints={READINESS_POINTS}
        savingsJourney={SAVINGS_JOURNEY}
        pricingPlans={PRICING_PLANS}
      />
    </div>
  );
}
