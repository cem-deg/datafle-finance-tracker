import { ArrowUpRight, Eye, ShieldCheck, SlidersHorizontal } from "lucide-react";

import ScrollReveal from "./ScrollReveal";
import styles from "./LandingPage.module.css";

interface LandingProductSpotlightSectionProps {
  mockupParallax?: number;
}

const SPOTLIGHT_POINTS = [
  {
    title: "Clarity",
    text: "Balance, burn rate, and budgets in one view.",
    Icon: Eye,
  },
  {
    title: "Control",
    text: "Category pressure before overspending happens.",
    Icon: SlidersHorizontal,
  },
  {
    title: "Insight",
    text: "Next actions that feel grounded, not noisy.",
    Icon: ShieldCheck,
  },
] as const;

export default function LandingProductSpotlightSection({
  mockupParallax = 0,
}: LandingProductSpotlightSectionProps) {
  return (
    <section
      className={styles.productSpotlightSection}
      id="product"
      aria-labelledby="product-spotlight-title"
      style={{ transform: `translateY(${mockupParallax * 0.06}px)` }}
    >
      <ScrollReveal>
        <div className={styles.productSpotlightShell}>
          <div className={styles.productSpotlightCopy}>
            <span className={styles.productSpotlightEyebrow}>Product spotlight</span>
            <h2 id="product-spotlight-title" className={styles.productSpotlightTitle}>
              A calmer command center for the decisions that actually move your money.
            </h2>
            <p className={styles.productSpotlightText}>
              See income, spending, category pressure, and next actions in one serious workspace built
              to feel readable at a glance and trustworthy every day.
            </p>

            <div className={styles.productSpotlightPoints}>
              {SPOTLIGHT_POINTS.map(({ title, text, Icon }) => (
                <article key={title} className={styles.productSpotlightPoint}>
                  <span className={styles.productSpotlightPointIcon} aria-hidden="true">
                    <Icon size={16} strokeWidth={2.1} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.productSpotlightVisual}>
            <div className={styles.productSpotlightMockup} aria-hidden="true">
              <div className={styles.productSpotlightChrome}>
                <span />
                <span />
                <span />
              </div>

              <div className={styles.productSpotlightHeader}>
                <div>
                  <span className={styles.productSpotlightLabel}>Product dashboard</span>
                  <strong>Financial command center</strong>
                </div>
                <div className={styles.productSpotlightStatus}>
                  <ArrowUpRight size={15} strokeWidth={2} />
                  Weekly trend improving
                </div>
              </div>

              <div className={styles.productSpotlightKpis}>
                <article className={styles.productSpotlightKpi}>
                  <span>Income</span>
                  <strong>$6,300</strong>
                  <small>30 day inflow</small>
                </article>
                <article className={styles.productSpotlightKpi}>
                  <span>Spent</span>
                  <strong>$1,480</strong>
                  <small>Trackable and categorized</small>
                </article>
                <article className={styles.productSpotlightKpi}>
                  <span>Budget left</span>
                  <strong>$2,120</strong>
                  <small>Still safe this month</small>
                </article>
              </div>

              <div className={styles.productSpotlightBody}>
                <section className={styles.productSpotlightPrimary}>
                  <div className={styles.productSpotlightPanelHeader}>
                    <div>
                      <span>Cashflow rhythm</span>
                      <strong>Weekly movement</strong>
                    </div>
                    <b>Live</b>
                  </div>

                  <div className={styles.productSpotlightChart}>
                    <div className={`${styles.productSpotlightChartLine} ${styles.productSpotlightChartLineOne}`} />
                    <div className={`${styles.productSpotlightChartLine} ${styles.productSpotlightChartLineTwo}`} />
                    <div className={`${styles.productSpotlightChartLine} ${styles.productSpotlightChartLineThree}`} />
                  </div>

                  <div className={styles.productSpotlightSummaryRow}>
                    <article>
                      <span>Checking</span>
                      <strong>$8,420</strong>
                    </article>
                    <article>
                      <span>Savings</span>
                      <strong>$22,180</strong>
                    </article>
                    <article>
                      <span>Investments</span>
                      <strong>$97,800</strong>
                    </article>
                  </div>
                </section>

                <aside className={styles.productSpotlightRail}>
                  <section className={styles.productSpotlightPanel}>
                    <div className={styles.productSpotlightPanelHeader}>
                      <div>
                        <span>Budget watch</span>
                        <strong>Category pressure</strong>
                      </div>
                    </div>

                    <div className={styles.productSpotlightBudgetRows}>
                      <div className={styles.productSpotlightBudgetRow}>
                        <div>
                          <strong>Food</strong>
                          <span>74% used</span>
                        </div>
                        <div className={styles.productSpotlightTrack}>
                          <i className={styles.productSpotlightTrackWarm} />
                        </div>
                      </div>
                      <div className={styles.productSpotlightBudgetRow}>
                        <div>
                          <strong>Transport</strong>
                          <span>46% used</span>
                        </div>
                        <div className={styles.productSpotlightTrack}>
                          <i className={styles.productSpotlightTrackCool} />
                        </div>
                      </div>
                      <div className={styles.productSpotlightBudgetRow}>
                        <div>
                          <strong>Savings</strong>
                          <span>On track</span>
                        </div>
                        <div className={styles.productSpotlightTrack}>
                          <i className={styles.productSpotlightTrackSafe} />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className={styles.productSpotlightPanel}>
                    <div className={styles.productSpotlightPanelHeader}>
                      <div>
                        <span>Recent activity</span>
                        <strong>Readable details</strong>
                      </div>
                    </div>

                    <div className={styles.productSpotlightTransactions}>
                      <div className={styles.productSpotlightTransaction}>
                        <span className={`${styles.productSpotlightDot} ${styles.productSpotlightDotGold}`} />
                        <div>
                          <strong>Groceries</strong>
                          <span>Today</span>
                        </div>
                        <em>-$48</em>
                      </div>
                      <div className={styles.productSpotlightTransaction}>
                        <span className={`${styles.productSpotlightDot} ${styles.productSpotlightDotBlue}`} />
                        <div>
                          <strong>Salary</strong>
                          <span>Auto sync</span>
                        </div>
                        <em className={styles.productSpotlightPositive}>+$3,200</em>
                      </div>
                      <div className={styles.productSpotlightTransaction}>
                        <span className={`${styles.productSpotlightDot} ${styles.productSpotlightDotSlate}`} />
                        <div>
                          <strong>Emergency fund</strong>
                          <span>Scheduled</span>
                        </div>
                        <em>+$240</em>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
