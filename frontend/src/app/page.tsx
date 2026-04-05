"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  CircleDollarSign,
  Gem,
  Layers3,
  Shield,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

const FEATURE_PANELS = [
  {
    title: "Executive-grade overview",
    description: "Income, expenses, budgets, and balance shown in one premium command center.",
    icon: <Layers3 size={22} />,
    accent: "var(--accent-primary-light)",
    bg: "rgba(124,106,239,0.12)",
  },
  {
    title: "Adaptive cashflow intelligence",
    description: "Insight and prediction layers that turn raw activity into financial direction.",
    icon: <BrainCircuit size={22} />,
    accent: "var(--accent-secondary)",
    bg: "rgba(0,210,211,0.12)",
  },
  {
    title: "Built for serious control",
    description: "Monthly budgets, category precision, and fast execution without spreadsheet fatigue.",
    icon: <Target size={22} />,
    accent: "var(--accent-warning)",
    bg: "rgba(253,203,110,0.12)",
  },
];

const VALUE_POINTS = [
  {
    title: "Signal over clutter",
    text: "Every screen is designed to surface the numbers that matter first, with less friction and more confidence.",
    icon: <BarChart3 size={20} />,
  },
  {
    title: "Premium operational feel",
    text: "Fast interactions, elegant motion, and polished surfaces create the feeling of a tool worth trusting daily.",
    icon: <Gem size={20} />,
  },
  {
    title: "Security-minded architecture",
    text: "JWT auth, structured services, migration flow, and a backend that is already being prepared for production-grade deployment.",
    icon: <Shield size={20} />,
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Capture the money flow",
    text: "Track income and spending in seconds with categories, dates, notes, and budget context.",
  },
  {
    step: "02",
    title: "See the full picture",
    text: "Understand net balance, category pressure, monthly drift, and budget burn before it becomes a problem.",
  },
  {
    step: "03",
    title: "Act with clarity",
    text: "Use insights, predictions, and category-level controls to improve your next financial decision.",
  },
];

const TRUST_METRICS = [
  { value: "3x", label: "stronger first-screen product impression" },
  { value: "<60s", label: "to understand balance, budgets, and spending pressure" },
  { value: "1", label: "clear workspace for income, expenses, and future growth" },
];

const READINESS_POINTS = [
  "Income, expense, and budget flows already live in one system",
  "Analytics and insights are structured for deeper product layers",
  "Migration and production planning started before scale becomes painful",
];

const PRICING_PLANS = [
  {
    name: "Personal",
    price: "Free",
    description: "A polished money cockpit for your personal finance workflow while the product is evolving.",
    points: ["Expense + income tracking", "Budget overview", "Insights and dashboard surface"],
    highlight: false,
  },
  {
    name: "Premium",
    price: "Soon",
    description: "The future direction for deeper planning, automation, exports, and stronger financial guidance.",
    points: ["Recurring transactions", "Advanced reporting", "Smarter guidance and exports"],
    highlight: true,
  },
];

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading) return null;
  if (user) return null;

  const heroParallax = Math.min(scrollY * 0.12, 28);
  const mockupParallax = Math.min(scrollY * 0.08, 24);

  return (
    <div className="landing-page premium-landing">
      <Navbar />

      <section className="premium-hero">
        <div className="premium-hero-backdrop" />
        <div className="premium-orb orb-one" />
        <div className="premium-orb orb-two" />
        <div className="premium-orb orb-three" />

        <div className="premium-hero-grid">
          <div className="premium-copy animate-in" style={{ transform: `translateY(${heroParallax * -0.16}px)` }}>
            <p className="hero-kicker">Personal finance, presented with product-grade polish.</p>

            <h1 className="premium-title">
              Built to feel like a
              {" "}
              <span className="gradient-text">modern financial product</span>
              , not a basic tracker.
            </h1>

            <p className="premium-subtitle">
              Datafle brings income, expenses, budgets, and insights into a more intentional interface.
              The goal is simple: make financial control feel sharp, premium, and genuinely useful from
              the first interaction.
            </p>

            <div className="premium-actions">
              <Link href="/register" className="btn btn-primary premium-cta">
                Enter The Dashboard <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn btn-secondary premium-secondary">
                Sign In
              </Link>
            </div>

            <div className="premium-proof">
              <div className="proof-chip">
                <CircleDollarSign size={16} />
                Income + expense command center
              </div>
              <div className="proof-chip">
                <Wallet size={16} />
                Monthly budget intelligence
              </div>
              <div className="proof-chip">
                <TrendingUp size={16} />
                Predictive insight layer
              </div>
            </div>
          </div>

          <div className="premium-showcase animate-in animate-in-delay-2" style={{ transform: `translateY(${heroParallax * 0.18}px)` }}>
            <div className="showcase-shell">
              <div className="showcase-topbar">
                <div className="showcase-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="showcase-label">Datafle / Financial Overview</div>
              </div>

              <div className="showcase-grid">
                <div className="showcase-card balance-card">
                  <div className="showcase-eyebrow">Net balance</div>
                  <div className="showcase-value">$4,820</div>
                  <div className="showcase-meta positive">+18.4% vs last month</div>
                </div>

                <div className="showcase-mini-grid">
                  <div className="showcase-card mini-card">
                    <div className="mini-icon" style={{ background: "rgba(0,184,148,0.14)", color: "var(--accent-success)" }}>
                      <Briefcase size={16} />
                    </div>
                    <div className="mini-title">Income</div>
                    <div className="mini-value">$6,300</div>
                  </div>
                  <div className="showcase-card mini-card">
                    <div className="mini-icon" style={{ background: "rgba(255,107,107,0.14)", color: "var(--accent-danger)" }}>
                      <Wallet size={16} />
                    </div>
                    <div className="mini-title">Spent</div>
                    <div className="mini-value">$1,480</div>
                  </div>
                </div>

                <div className="showcase-card chart-card">
                  <div className="card-heading-row">
                    <div>
                      <div className="showcase-eyebrow">Budget pressure</div>
                      <div className="chart-title">This month&apos;s burn</div>
                    </div>
                    <span className="chart-badge">74% used</span>
                  </div>

                  <div className="budget-bars">
                    <div className="budget-row">
                      <span>Food</span>
                      <div className="budget-track"><div className="budget-fill fill-food" /></div>
                      <strong>$420</strong>
                    </div>
                    <div className="budget-row">
                      <span>Transport</span>
                      <div className="budget-track"><div className="budget-fill fill-transport" /></div>
                      <strong>$185</strong>
                    </div>
                    <div className="budget-row">
                      <span>Lifestyle</span>
                      <div className="budget-track"><div className="budget-fill fill-lifestyle" /></div>
                      <strong>$260</strong>
                    </div>
                  </div>
                </div>

                <div className="showcase-card insight-card">
                  <div className="insight-chip">
                    <BrainCircuit size={16} />
                    Spending signal
                  </div>
                  <p>
                    Your fixed spending stayed stable while discretionary purchases rose 12%.
                    Reducing shopping by 10% restores your ideal monthly margin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-metrics-band">
        <div className="metrics-shell animate-in">
          {TRUST_METRICS.map((metric, index) => (
            <article key={metric.label} className={`metric-card animate-in animate-in-delay-${(index % 4) + 1}`}>
              <div className="metric-value">{metric.value}</div>
              <p>{metric.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-feature-band" id="features">
        <div className="section-header animate-in">
          <h2>Designed to feel expensive, because clarity should.</h2>
          <p>Datafle pairs a polished surface with practical control, so the product feels premium and performs like it matters.</p>
        </div>

        <div className="premium-panels">
          {FEATURE_PANELS.map((panel, index) => (
            <article key={panel.title} className={`premium-panel animate-in animate-in-delay-${(index % 4) + 1}`}>
              <div className="premium-panel-icon" style={{ background: panel.bg, color: panel.accent }}>
                {panel.icon}
              </div>
              <h3>{panel.title}</h3>
              <p>{panel.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-mockup-band" id="product">
        <div className="mockup-copy animate-in">
          <p className="section-kicker">Interface preview</p>
          <h2>A landing experience that actually previews the product ambition.</h2>
          <p>
            Instead of generic marketing blocks, the page now gives visitors a more visual preview of the
            interface quality, interaction polish, and decision-making layer the product is aiming for.
          </p>
        </div>

        <div className="mockup-stage animate-in animate-in-delay-2" style={{ transform: `translateY(${mockupParallax}px)` }}>
          <div className="mockup-panel primary-mockup">
            <div className="mockup-panel-header">
              <span>Dashboard Preview</span>
              <strong>Live product direction</strong>
            </div>
            <div className="mockup-chart-area">
              <div className="mockup-line one" />
              <div className="mockup-line two" />
              <div className="mockup-line three" />
            </div>
            <div className="mockup-stat-row">
              <div className="mockup-stat-block">
                <label>Monthly income</label>
                <strong>$6,300</strong>
              </div>
              <div className="mockup-stat-block">
                <label>Planned budgets</label>
                <strong>8 categories</strong>
              </div>
              <div className="mockup-stat-block">
                <label>Cash runway</label>
                <strong>Healthy</strong>
              </div>
            </div>
          </div>

          <div className="mockup-panel floating-mockup floating-mockup-a">
            <span>Spending rhythm</span>
            <strong>Controlled</strong>
            <p>High-signal dashboard blocks keep category pressure visible.</p>
          </div>

          <div className="mockup-panel floating-mockup floating-mockup-b">
            <span>Product feel</span>
            <strong>Intentional</strong>
            <p>Typography, motion, and surfaces are tuned to feel modern and premium.</p>
          </div>
        </div>
      </section>

      <section className="premium-value-grid">
        <div className="value-copy animate-in">
          <p className="section-kicker">Presentation quality</p>
          <h2>More than a tracker. A product people want to stay inside.</h2>
          <p>
            The experience is intentionally shaped to feel current, credible, and elevated.
            From motion cadence to information hierarchy, the goal is to create the impression
            that you&apos;re using a serious modern finance product.
          </p>
        </div>

        <div className="value-stack">
          {VALUE_POINTS.map((point, index) => (
            <article key={point.title} className={`value-card animate-in animate-in-delay-${(index % 4) + 1}`}>
              <div className="value-icon">{point.icon}</div>
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-workflow" id="how-it-works">
        <div className="section-header animate-in">
          <h2>A cleaner financial ritual.</h2>
          <p>Every step is designed to move from entry to insight with less friction and more confidence.</p>
        </div>

        <div className="workflow-grid">
          {WORKFLOW.map((item, index) => (
            <article key={item.step} className={`workflow-card animate-in animate-in-delay-${(index % 4) + 1}`}>
              <div className="workflow-step">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-trust-band">
        <div className="section-header animate-in">
          <h2>Designed with a strong foundation for a more serious product journey.</h2>
          <p>The experience is already being shaped around structure, clarity, and long-term scalability rather than surface-level polish alone.</p>
        </div>

        <div className="trust-grid single-column">
          <article className="trust-card animate-in">
            <div className="trust-card-grid">
              <div className="trust-copy">
                <div className="trust-card-badge">
                  <Shield size={16} />
                  Foundation
                </div>
                <h3>Structured more like a product system than a temporary demo surface.</h3>
                <p>Authentication, migrations, analytics services, and modular finance domains already create a cleaner base for scaling the product with more confidence.</p>
              </div>

              <div className="trust-points-wrap">
                <ul className="trust-points">
                  {READINESS_POINTS.map((point) => (
                    <li key={point}><CheckCircle2 size={16} /> {point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="pricing-band" id="pricing">
        <div className="section-header animate-in">
          <h2>Simple pricing direction for the product journey.</h2>
          <p>The product is still taking shape, so the current message is intentionally straightforward and believable.</p>
        </div>

        <div className="pricing-grid">
          {PRICING_PLANS.map((plan, index) => (
            <article key={plan.name} className={`pricing-card ${plan.highlight ? "highlight" : ""} animate-in animate-in-delay-${(index % 4) + 1}`}>
              <div className="pricing-top">
                <div>
                  <span className="pricing-label">{plan.name}</span>
                  <h3>{plan.price}</h3>
                </div>
                {plan.highlight && <span className="pricing-badge">Roadmap</span>}
              </div>
              <p>{plan.description}</p>
              <ul className="pricing-points">
                {plan.points.map((point) => (
                  <li key={point}><CheckCircle2 size={16} /> {point}</li>
                ))}
              </ul>
              <Link href={plan.highlight ? "/login" : "/register"} className={`btn ${plan.highlight ? "btn-secondary" : "btn-primary"} pricing-button`}>
                {plan.highlight ? "Preview Existing Workspace" : "Create Your Account"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="premium-cta-band">
        <div className="premium-cta-card animate-in">
          <div>
            <p className="section-kicker">Get started</p>
            <h2>Give your finances a product experience that actually feels premium.</h2>
            <p>Track cashflow, control budgets, and surface decisions with an interface that looks as refined as the ambition behind it.</p>
          </div>

          <div className="premium-actions cta-actions">
            <Link href="/register" className="btn btn-primary premium-cta">
              Create Your Account <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn btn-secondary premium-secondary">
              Explore Existing Workspace
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer premium-footer">
        <p>&copy; {new Date().getFullYear()} Datafle. Precision, polish, and control for modern personal finance.</p>
      </footer>
    </div>
  );
}
