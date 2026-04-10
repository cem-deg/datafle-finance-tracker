import Navbar from "@/components/layout/Navbar";

import HeroSection from "./HeroSection";
import LandingSections from "./LandingSections";
import {
  PHONE_ACTIVITY,
  TRUST_STRIP_ITEMS,
} from "./content";
import styles from "./LandingPage.module.css";

interface LandingPageContentProps {
  heroParallax: number;
}

export default function LandingPageContent({ heroParallax }: LandingPageContentProps) {
  return (
    <div className={styles.page}>
      <Navbar />
      <HeroSection heroParallax={heroParallax} phoneActivity={PHONE_ACTIVITY} />
      <LandingSections trustStripItems={TRUST_STRIP_ITEMS} />
    </div>
  );
}
