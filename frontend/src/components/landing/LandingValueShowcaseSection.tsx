import {
  Eye,
  ReceiptText,
  WalletCards,
} from "lucide-react";

import { VALUE_SHOWCASE_ITEMS } from "./content";
import ScrollReveal from "./ScrollReveal";
import styles from "./ValueShowcase.module.css";
import landingStyles from "./LandingPage.module.css";

const iconMap = {
  expenses: ReceiptText,
  budgets: WalletCards,
  awareness: Eye,
} as const;

const cardClassMap = {
  expenses: styles.valueShowcaseCardExpenses,
  budgets: styles.valueShowcaseCardBudgets,
  awareness: styles.valueShowcaseCardAwareness,
} as const;

function ExpenseVisual() {
  return (
    <div className={`${styles.valueShowcaseVisual} ${styles.valueShowcaseVisualExpenses}`} aria-hidden="true">
      <div className={styles.valueShowcaseTransactions}>
        <div className={styles.valueShowcaseTransactionRow}>
          <span className={`${styles.valueShowcaseDot} ${styles.valueShowcaseDotSoft}`} />
          <div className={styles.valueShowcaseTransactionCopy}>
            <strong>Groceries</strong>
            <span>Today</span>
          </div>
          <em>-$48</em>
        </div>
        <div className={styles.valueShowcaseTransactionRow}>
          <span className={`${styles.valueShowcaseDot} ${styles.valueShowcaseDotWarm}`} />
          <div className={styles.valueShowcaseTransactionCopy}>
            <strong>Transport</strong>
            <span>Morning</span>
          </div>
          <em>-$16</em>
        </div>
        <div className={styles.valueShowcaseTransactionRow}>
          <span className={`${styles.valueShowcaseDot} ${styles.valueShowcaseDotCool}`} />
          <div className={styles.valueShowcaseTransactionCopy}>
            <strong>Coffee</strong>
            <span>Quick add</span>
          </div>
          <em>-$6</em>
        </div>
      </div>
    </div>
  );
}

function BudgetVisual() {
  return (
    <div className={`${styles.valueShowcaseVisual} ${styles.valueShowcaseVisualBudgets}`} aria-hidden="true">
      <div className={styles.valueShowcaseBudgetRows}>
        <div className={styles.valueShowcaseBudgetRow}>
          <div className={styles.valueShowcaseBudgetMeta}>
            <strong>Education</strong>
            <span>58%</span>
          </div>
          <div className={styles.valueShowcaseBudgetTrack}>
            <span className={styles.valueShowcaseBudgetFillSafe} />
          </div>
        </div>
        <div className={styles.valueShowcaseBudgetRow}>
          <div className={styles.valueShowcaseBudgetMeta}>
            <strong>Food</strong>
            <span>74%</span>
          </div>
          <div className={styles.valueShowcaseBudgetTrack}>
            <span className={styles.valueShowcaseBudgetFillWarm} />
          </div>
        </div>
        <div className={styles.valueShowcaseBudgetRow}>
          <div className={styles.valueShowcaseBudgetMeta}>
            <strong>Travel</strong>
            <span>29%</span>
          </div>
          <div className={styles.valueShowcaseBudgetTrack}>
            <span className={styles.valueShowcaseBudgetFillCool} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AwarenessVisual() {
  return (
    <div className={`${styles.valueShowcaseVisual} ${styles.valueShowcaseVisualAwareness}`} aria-hidden="true">
      <div className={styles.valueShowcaseChartShell}>
        <svg
          className={styles.valueShowcaseChart}
          viewBox="0 0 220 108"
          role="presentation"
          focusable="false"
        >
          <path
            className={styles.valueShowcaseChartGrid}
            d="M20 24H200M20 54H200M20 84H200"
          />
          <path
            className={styles.valueShowcaseChartLine}
            d="M20 76C42 72 54 50 78 46C104 42 116 60 138 52C156 46 172 24 200 18"
          />
          <circle className={styles.valueShowcaseChartPoint} cx="78" cy="46" r="4" />
          <circle className={styles.valueShowcaseChartPointAccent} cx="200" cy="18" r="5" />
        </svg>
        <div className={styles.valueShowcaseInsightText}>Saved $50</div>
      </div>
    </div>
  );
}

function renderVisual(theme: (typeof VALUE_SHOWCASE_ITEMS)[number]["theme"]) {
  switch (theme) {
    case "expenses":
      return <ExpenseVisual />;
    case "budgets":
      return <BudgetVisual />;
    case "awareness":
      return <AwarenessVisual />;
    default:
      return null;
  }
}

export default function LandingValueShowcaseSection() {
  return (
    <section
      className={styles.valueShowcaseSection}
      id="features"
      aria-labelledby="value-showcase-title"
    >
      <div className={styles.valueShowcaseSectionGlow} aria-hidden="true" />
      <ScrollReveal>
        <div className={styles.valueShowcaseShell}>
          <div className={styles.valueShowcaseHeader}>
            <h2 id="value-showcase-title" className={styles.valueShowcaseHeading}>
              Three calm surfaces that explain the product fast.
            </h2>
          </div>

          <div className={landingStyles.valueShowcaseGrid}>
            {VALUE_SHOWCASE_ITEMS.map((item) => {
              const Icon = iconMap[item.theme];

              return (
                <article
                  key={item.title}
                  className={`${landingStyles.valueShowcaseCard} ${cardClassMap[item.theme]}`}
                >
                  <div className={styles.valueShowcaseCardHeader}>
                    <span className={styles.valueShowcaseCardIcon} aria-hidden="true">
                      <Icon size={16} strokeWidth={2.1} />
                    </span>
                    <div className={styles.valueShowcaseCardCopy}>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </div>
                  {renderVisual(item.theme)}
                </article>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
