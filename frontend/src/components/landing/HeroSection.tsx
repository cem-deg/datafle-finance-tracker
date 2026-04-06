import Link from "next/link";
import { ArrowRight, BrainCircuit, CircleDollarSign, TrendingUp, Wallet } from "lucide-react";

import type { PhoneActivityItem } from "./content";
import styles from "./LandingPage.module.css";

interface HeroSectionProps {
  heroParallax: number;
  phoneActivity: PhoneActivityItem[];
}

export default function HeroSection({ heroParallax, phoneActivity }: HeroSectionProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackdrop} />
      <div className={`${styles.heroOrb} ${styles.orbOne}`} />
      <div className={`${styles.heroOrb} ${styles.orbTwo}`} />
      <div className={`${styles.heroOrb} ${styles.orbThree}`} />

      <div className={styles.heroGrid}>
        <div className={styles.heroCopy} style={{ transform: `translateY(${heroParallax * -0.16}px)` }}>
          <p className={styles.kicker}>Personal finance, presented with product-grade polish.</p>

          <h1 className={styles.heroTitle}>
            Built to feel like a <span>modern financial product</span>, not a basic tracker.
          </h1>

          <p className={styles.heroSubtitle}>
            Datafle brings income, expenses, budgets, and insights into a more intentional interface.
            The goal is simple: make financial control feel sharp, premium, and genuinely useful from
            the first interaction.
          </p>

          <div className={styles.heroActions}>
            <Link href="/register" className="btn btn-primary">
              Create Your Account <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>

          <div className={styles.proofRow}>
            <div className={styles.proofChip}>
              <CircleDollarSign size={16} />
              Income + expense command center
            </div>
            <div className={styles.proofChip}>
              <Wallet size={16} />
              Monthly budget intelligence
            </div>
            <div className={styles.proofChip}>
              <TrendingUp size={16} />
              Predictive insight layer
            </div>
          </div>
        </div>

        <div className={styles.heroShowcase} style={{ transform: `translateY(${heroParallax * 0.18}px)` }}>
          <div className={styles.phoneStage}>
            <div className={`${styles.heroChip} ${styles.chipTop}`}>
              <TrendingUp size={16} />
              +12% savings pace
            </div>

            <div className={`${styles.heroChip} ${styles.chipBottom}`}>
              <BrainCircuit size={16} />
              Budget health 82%
            </div>

            <div className={styles.phoneFrame} aria-hidden="true">
              <div className={`${styles.phoneSideButton} ${styles.buttonAction}`} />
              <div className={`${styles.phoneSideButton} ${styles.buttonVolumeUp}`} />
              <div className={`${styles.phoneSideButton} ${styles.buttonVolumeDown}`} />
              <div className={`${styles.phoneSideButton} ${styles.buttonPower}`} />

              <div className={styles.phoneBezel}>
                <div className={styles.phoneScreenReflection} />
                <div className={styles.phoneNotch}>
                  <span className={styles.phoneNotchSpeaker} />
                  <span className={styles.phoneNotchCamera} />
                </div>

                <div className={styles.phoneScreen}>
                  <div className={styles.phoneStatusRow}>
                    <span className={styles.phoneTime}>9:41</span>
                    <div className={styles.phoneStatusIcons}>
                      <span className={styles.statusSignal} />
                      <span className={styles.statusWifi} />
                      <span className={styles.statusBattery}><span /></span>
                    </div>
                  </div>

                  <div className={styles.phoneCard}>
                    <div className={styles.phoneEyebrow}>Available balance</div>
                    <strong>$4,820</strong>
                    <span>+$740 this month after budgets</span>
                  </div>

                  <div className={styles.phoneInsightStrip}>
                    <div className={styles.phoneMiniStat}>
                      <span>Income</span>
                      <strong>$6,300</strong>
                    </div>
                    <div className={styles.phoneMiniStat}>
                      <span>Spent</span>
                      <strong>$1,480</strong>
                    </div>
                  </div>

                  <div className={styles.phoneCard}>
                    <div className={styles.phoneChartHeader}>
                      <div>
                        <span>Budget rhythm</span>
                        <strong>Controlled trajectory</strong>
                      </div>
                      <div className={styles.phoneChartPill}>Live</div>
                    </div>

                    <div className={styles.phoneChartPlot}>
                      <div className={`${styles.phoneChartLine} ${styles.lineOne}`} />
                      <div className={`${styles.phoneChartLine} ${styles.lineTwo}`} />
                      <div className={`${styles.phoneChartLine} ${styles.lineThree}`} />
                    </div>
                  </div>

                  <div className={styles.phoneCard}>
                    <div className={styles.phoneCardTitle}>Recent activity</div>
                    <div className={styles.phoneActivityList}>
                      {phoneActivity.map((item) => (
                        <div key={item.label} className={styles.phoneActivityRow}>
                          <div className={`${styles.phoneActivityDot} ${item.tone === "positive" ? styles.positive : styles.negative}`} />
                          <span>{item.label}</span>
                          <strong className={item.tone === "positive" ? styles.positiveText : styles.negativeText}>
                            {item.amount}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.phoneBottomNav}>
                    <div className={`${styles.phoneNavPill} ${styles.active}`}>Overview</div>
                    <div className={styles.phoneNavPill}>Budgets</div>
                    <div className={styles.phoneNavPill}>Insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
