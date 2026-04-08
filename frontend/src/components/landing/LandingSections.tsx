import Link from "next/link";
import { BarChart3, BrainCircuit, CheckCircle2, Shield, Target } from "lucide-react";

interface LandingSectionsProps {
  mockupParallax?: number;
}

export default function LandingSections({
  mockupParallax = 0,
}: LandingSectionsProps) {
  return (
    <>
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>A focused workflow for everyday personal finance</h2>
          <p>Every screen is built to keep important decisions easy to find and act on.</p>
        </div>
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon metric-icon"><Target size={20} /></div>
            <h3>Transaction ledger</h3>
            <p>Add, edit, filter, and review daily expenses and incomes with predictable workflows.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon metric-icon-cyan"><BarChart3 size={20} /></div>
            <h3>Analytics that explain trends</h3>
            <p>See monthly movement, category distribution, and recent trend lines without visual noise.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon metric-icon-success"><BrainCircuit size={20} /></div>
            <h3>Actionable insights</h3>
            <p>Get concise recommendations based on spending behavior and category concentration.</p>
          </article>
          <article className="feature-card">
            <div className="feature-icon metric-icon-warning"><Shield size={20} /></div>
            <h3>Trust-first structure</h3>
            <p>Consistent states, predictable forms, and controlled interactions across all pages.</p>
          </article>
        </div>
      </section>

      <section className="how-it-works landing-product-preview" id="product" style={{ transform: `translateY(${mockupParallax * 0.06}px)` }}>
        <div className="section-header">
          <h2>See the product structure at a glance</h2>
          <p>A stable, theme-safe preview of how the workspace is organized.</p>
        </div>
        <div className="landing-preview-surface">
          <div className="landing-preview-header">
            <strong>Dashboard snapshot</strong>
            <span>Last 30 days</span>
          </div>
          <div className="landing-preview-kpis">
            <article>
              <p>Income</p>
              <strong>$6,300</strong>
            </article>
            <article>
              <p>Spent</p>
              <strong>$1,480</strong>
            </article>
            <article>
              <p>Budget remaining</p>
              <strong>$2,120</strong>
            </article>
          </div>
          <div className="landing-preview-progress">
            <p>Top category budget</p>
            <div><span style={{ width: "68%" }} /></div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="section-header">
          <h2>A straightforward product flow</h2>
          <p>From first entry to insight in three clean steps.</p>
        </div>
        <div className="steps-grid">
          <article className="step-item">
            <div className="step-number">1</div>
            <h3>Capture transactions</h3>
            <p>Record money in and out with category detail and dates.</p>
          </article>
          <article className="step-item">
            <div className="step-number">2</div>
            <h3>Set budget limits</h3>
            <p>Define monthly category caps and monitor budget pressure.</p>
          </article>
          <article className="step-item">
            <div className="step-number">3</div>
            <h3>Review and adjust</h3>
            <p>Use dashboards and insights to improve next month’s plan.</p>
          </article>
        </div>
      </section>

      <section className="features-section" id="pricing">
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
      </section>
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Datafle. Precision, polish, and control for modern personal finance.</p>
      </footer>
    </>
  );
}
