import type { ReactNode } from "react";

import {
  PiggyBank,
  ReceiptText,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "./ScrollReveal";
import styles from "./LandingPage.module.css";

type SavingStep = {
  step: string;
  title: string;
  text: string;
  Icon: typeof SlidersHorizontal;
  riseClass: string;
  toneClass: string;
  visual: ReactNode;
  phase?: string;
  payoff?: boolean;
};

const SAVING_STEPS: SavingStep[] = [
  {
    step: "01",
    title: "Define your spending",
    text: "Set a clear split for essentials, lifestyle, and savings before the month moves.",
    Icon: SlidersHorizontal,
    riseClass: styles.savingStepsRiseOne,
    toneClass: styles.savingStepsPlan,
    visual: (
      <div className={styles.savingStepsVisual} aria-hidden="true">
        <div className={styles.savingStepsMiniHeader}>
          <span>Monthly frame</span>
          <strong>50 / 30 / 20</strong>
        </div>
        <div className={styles.savingStepsBudgetRows}>
          <div className={styles.savingStepsBudgetRow}>
            <div className={styles.savingStepsBudgetMeta}>
              <strong>Needs</strong>
              <span>50%</span>
            </div>
            <div className={styles.savingStepsBudgetTrack}>
              <i className={styles.savingStepsBudgetFillNeeds} />
            </div>
          </div>
          <div className={styles.savingStepsBudgetRow}>
            <div className={styles.savingStepsBudgetMeta}>
              <strong>Lifestyle</strong>
              <span>30%</span>
            </div>
            <div className={styles.savingStepsBudgetTrack}>
              <i className={styles.savingStepsBudgetFillLifestyle} />
            </div>
          </div>
          <div className={styles.savingStepsBudgetRow}>
            <div className={styles.savingStepsBudgetMeta}>
              <strong>Savings</strong>
              <span>20%</span>
            </div>
            <div className={styles.savingStepsBudgetTrack}>
              <i className={styles.savingStepsBudgetFillSavings} />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "Add your transactions",
    text: "Log purchases and income quickly so your balance always reflects real life.",
    Icon: ReceiptText,
    riseClass: styles.savingStepsRiseTwo,
    toneClass: styles.savingStepsCapture,
    visual: (
      <div className={styles.savingStepsVisual} aria-hidden="true">
        <div className={styles.savingStepsInputBar}>
          <span>Taxi home</span>
          <strong>-$18.40</strong>
        </div>
        <div className={styles.savingStepsLedger}>
          <div className={styles.savingStepsLedgerItem}>
            <b className={styles.savingStepsLedgerDotWarm} />
            <div className={styles.savingStepsLedgerMeta}>
              <strong>Groceries</strong>
              <span>Today, 14:20</span>
            </div>
            <em>-$42</em>
          </div>
          <div className={styles.savingStepsLedgerItem}>
            <b className={styles.savingStepsLedgerDotCool} />
            <div className={styles.savingStepsLedgerMeta}>
              <strong>Salary</strong>
              <span>Auto sync</span>
            </div>
            <em className={styles.savingStepsLedgerPositive}>+$620</em>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "03",
    title: "We organize everything",
    text: "Your activity is grouped into clean categories, tags, and recurring patterns automatically.",
    Icon: Sparkles,
    riseClass: styles.savingStepsRiseThree,
    toneClass: styles.savingStepsOrganize,
    visual: (
      <div className={styles.savingStepsVisual} aria-hidden="true">
        <div className={styles.savingStepsGroupGrid}>
          <div className={styles.savingStepsGroupItem}>
            <strong>Food</strong>
            <span>8 items</span>
          </div>
          <div className={styles.savingStepsGroupItem}>
            <strong>Bills</strong>
            <span>Recurring</span>
          </div>
          <div className={styles.savingStepsGroupItem}>
            <strong>Travel</strong>
            <span>Grouped</span>
          </div>
        </div>
        <div className={styles.savingStepsTagRow}>
          <span>Sorted</span>
          <span>Recurring</span>
          <span>Ready for insight</span>
        </div>
      </div>
    ),
  },
  {
    step: "04",
    title: "Keep more",
    phase: "Start saving smarter",
    text: "See what is safe to spend and grow your savings.",
    Icon: PiggyBank,
    riseClass: styles.savingStepsRiseFour,
    toneClass: styles.savingStepsResult,
    payoff: true,
    visual: (
      <div className={`${styles.savingStepsVisual} ${styles.savingStepsResultVisual}`} aria-hidden="true">
        <div className={styles.savingStepsResultPanel}>
          <div className={styles.savingStepsResultMetric}>
            <span>Safe to spend</span>
            <strong>$420</strong>
          </div>
          <div className={styles.savingStepsResultStack}>
            <div className={styles.savingStepsResultLine}>
              <span>Saved this month</span>
              <strong>+$180</strong>
            </div>
            <div className={styles.savingStepsResultLine}>
              <span>Next transfer</span>
              <strong>$80 Friday</strong>
            </div>
          </div>
          <div className={styles.savingStepsResultTrack}>
            <i />
          </div>
        </div>
      </div>
    ),
  },
];

export default function LandingHowItWorksSection() {
  return (
    <section className={styles.savingStepsSection} aria-labelledby="saving-steps-title">
      <ScrollReveal>
        <div className={styles.savingStepsShell}>
          <div className={styles.savingStepsHeader}>
            <span className={styles.savingStepsEyebrow}>How it works</span>
            <h2 id="saving-steps-title" className={styles.savingStepsHeading}>
              A compact path from everyday spending to smarter saving.
            </h2>
            <p className={styles.savingStepsIntro}>
              Four clean steps that turn daily money movement into a clearer plan and a stronger saving habit.
            </p>
          </div>

          <div className={styles.savingStepsGrid}>
            {SAVING_STEPS.map(({ step, title, text, phase, Icon, riseClass, toneClass, payoff, visual }) => (
              <div
                key={step}
                className={`${styles.savingStepsCardSlot} ${riseClass} ${payoff ? styles.savingStepsCardSlotPayoff : ""}`}
              >
                <article className={`${styles.savingStepsCard} ${toneClass}`}>
                  <div className={styles.savingStepsTop}>
                    <span className={styles.savingStepsStep}>{step}</span>
                    <span className={styles.savingStepsIcon} aria-hidden="true">
                      <Icon size={15} strokeWidth={2.1} />
                    </span>
                  </div>

                  <span
                    className={phase ? styles.savingStepsPhase : `${styles.savingStepsPhase} ${styles.savingStepsPhasePlaceholder}`}
                    aria-hidden={!phase}
                  >
                    {phase}
                  </span>

                  <div className={styles.savingStepsCopy}>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>

                  {visual}
                </article>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
