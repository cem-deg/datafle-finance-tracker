import Link from "next/link";
import { BarChart3, BrainCircuit, CheckCircle2, Gem, Layers3, Shield, Target } from "lucide-react";

import SectionHeader from "./SectionHeader";
import type {
  FeaturePanel,
  PricingPlan,
  SavingsJourneyItem,
  TrustMetric,
  ValuePoint,
  WorkflowStep,
} from "./content";
import styles from "./LandingPage.module.css";

interface LandingSectionsProps {
  mockupParallax: number;
  trustMetrics: TrustMetric[];
  featurePanels: FeaturePanel[];
  valuePoints: ValuePoint[];
  workflow: WorkflowStep[];
  readinessPoints: string[];
  savingsJourney: SavingsJourneyItem[];
  pricingPlans: PricingPlan[];
}

function resolveFeatureIcon(icon: FeaturePanel["icon"]) {
  if (icon === "overview") return <Layers3 size={22} />;
  if (icon === "insight") return <BrainCircuit size={22} />;
  return <Target size={22} />;
}

function resolveValueIcon(icon: ValuePoint["icon"]) {
  if (icon === "signal") return <BarChart3 size={20} />;
  if (icon === "premium") return <Gem size={20} />;
  return <Shield size={20} />;
}

export default function LandingSections({
  mockupParallax,
  trustMetrics,
  featurePanels,
  valuePoints,
  workflow,
  readinessPoints,
  savingsJourney,
  pricingPlans,
}: LandingSectionsProps) {
  return (
    <>
      <section className={styles.section}>
        <div className={styles.metricsGrid}>
          {trustMetrics.map((metric) => (
            <article key={metric.label} className={styles.metricCard}>
              <div className={styles.metricValue}>{metric.value}</div>
              <p>{metric.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="features">
        <SectionHeader
          title="Designed to feel expensive, because clarity should."
          description="Datafle pairs a polished surface with practical control, so the product feels premium and performs like it matters."
        />
        <div className={styles.panelGrid}>
          {featurePanels.map((panel) => (
            <article key={panel.title} className={styles.panelCard}>
              <div className={styles.panelIcon} style={{ background: panel.background, color: panel.accent }}>
                {resolveFeatureIcon(panel.icon)}
              </div>
              <h3>{panel.title}</h3>
              <p>{panel.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="product">
        <div className={styles.mockupGrid}>
          <div>
            <p className={styles.kicker}>Interface preview</p>
            <h2 className={styles.sectionTitle}>A landing experience that previews product ambition.</h2>
            <p className={styles.sectionText}>
              Instead of generic marketing blocks, the page now gives visitors a visual preview of the
              interface quality, interaction polish, and decision-making layer the product is aiming for.
            </p>
          </div>

          <div className={styles.mockupStage} style={{ transform: `translateY(${mockupParallax}px)` }}>
            <div className={styles.mockupPrimary}>
              <div className={styles.mockupHeader}>
                <span>Dashboard Preview</span>
                <strong>Live product direction</strong>
              </div>
              <div className={styles.mockupChartArea}>
                <div className={`${styles.mockupLine} ${styles.one}`} />
                <div className={`${styles.mockupLine} ${styles.two}`} />
                <div className={`${styles.mockupLine} ${styles.three}`} />
              </div>
              <div className={styles.mockupStats}>
                <div className={styles.mockupStat}>
                  <span>Monthly income</span>
                  <strong>$6,300</strong>
                </div>
                <div className={styles.mockupStat}>
                  <span>Planned budgets</span>
                  <strong>8 categories</strong>
                </div>
                <div className={styles.mockupStat}>
                  <span>Cash runway</span>
                  <strong>Healthy</strong>
                </div>
              </div>
            </div>

            <div className={styles.mockupFloating}>
              <span>Spending rhythm</span>
              <strong>Controlled</strong>
              <p>High-signal dashboard blocks keep category pressure visible.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.valueGrid}>
          <div className={styles.valueCopy}>
            <p className={styles.kicker}>Presentation quality</p>
            <h2 className={styles.sectionTitle}>More than a tracker. A product people want to stay inside.</h2>
            <p className={styles.sectionText}>
              The experience is intentionally shaped to feel current, credible, and elevated.
              From motion cadence to information hierarchy, the goal is to create the impression
              that you&apos;re using a serious modern finance product.
            </p>
          </div>

          <div className={styles.valueStack}>
            {valuePoints.map((point) => (
              <article key={point.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{resolveValueIcon(point.icon)}</div>
                <div>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="how-it-works">
        <SectionHeader
          title="A cleaner financial ritual."
          description="Every step is designed to move from entry to insight with less friction and more confidence."
        />
        <div className={styles.workflowGrid}>
          {workflow.map((item) => (
            <article key={item.step} className={styles.workflowCard}>
              <div className={styles.workflowStep}>{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <SectionHeader
          title="Designed with a strong foundation for a serious product journey."
          description="The experience is shaped around structure, clarity, and long-term scalability."
        />

        <div className={styles.trustGrid}>
          <div>
            <div className={styles.trustBadge}>
              <Shield size={16} />
              Foundation
            </div>
            <h3>Structured more like a product system than a temporary demo surface.</h3>
            <p>
              Authentication, migrations, analytics services, and modular finance domains create
              a cleaner base for scaling the product with confidence.
            </p>
            <ul className={styles.trustPoints}>
              {readinessPoints.map((point) => (
                <li key={point}><CheckCircle2 size={16} /> {point}</li>
              ))}
            </ul>
          </div>

          <div className={styles.trustVisual}>
            <div className={styles.trustHeading}>Savings momentum</div>
            <div className={styles.trustSummary}>
              <strong>Up to $460 more monthly breathing room</strong>
              <p>Clearer budget visibility and faster expense awareness help users protect more of what they earn.</p>
            </div>

            <div className={styles.comparisonChart}>
              {savingsJourney.map((item) => (
                <div key={item.label} className={styles.comparisonRow}>
                  <div className={styles.comparisonLabel}>{item.label}</div>
                  <div className={styles.comparisonBars}>
                    <div className={styles.barGroup}>
                      <span>Before</span>
                      <div className={styles.barTrack}><div className={styles.barBefore} style={{ width: item.beforeWidth }} /></div>
                      <strong>{item.before}</strong>
                    </div>
                    <div className={styles.barGroup}>
                      <span>With Datafle</span>
                      <div className={styles.barTrack}><div className={styles.barAfter} style={{ width: item.afterWidth }} /></div>
                      <strong>{item.after}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section} id="pricing">
        <SectionHeader
          title="Simple pricing direction for the product journey."
          description="The product is still taking shape, so the current message is intentionally straightforward."
        />
        <div className={styles.pricingGrid}>
          {pricingPlans.map((plan) => (
            <article key={plan.name} className={`${styles.pricingCard} ${plan.highlight ? styles.highlight : ""}`}>
              <div className={styles.pricingTop}>
                <div>
                  <span className={styles.pricingLabel}>{plan.name}</span>
                  <h3>{plan.price}</h3>
                </div>
                {plan.highlight && <span className={styles.pricingBadge}>Roadmap</span>}
              </div>
              <p>{plan.description}</p>
              <ul className={styles.pricingPoints}>
                {plan.points.map((point) => (
                  <li key={point}><CheckCircle2 size={16} /> {point}</li>
                ))}
              </ul>
              <Link href={plan.highlight ? "/login" : "/register"} className={`btn ${plan.highlight ? "btn-secondary" : "btn-primary"} ${styles.pricingButton}`}>
                {plan.highlight ? "Preview Existing Workspace" : "Create Your Account"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.ctaCard}>
          <div>
            <p className={styles.kicker}>Get started</p>
            <h2>Give your finances a product experience that actually feels premium.</h2>
            <p>Track cashflow, control budgets, and surface decisions with an interface that matches the ambition behind it.</p>
          </div>
          <div className={styles.ctaActions}>
            <Link href="/register" className="btn btn-primary">
              Create Your Account
            </Link>
            <Link href="/login" className="btn btn-secondary">
              Explore Existing Workspace
            </Link>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Datafle. Precision, polish, and control for modern personal finance.</p>
      </footer>
    </>
  );
}
