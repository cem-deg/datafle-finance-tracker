"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import styles from "./LandingPage.module.css";

type SavingStep = {
  step: string;
  title: string;
  text: string;
  riseClass: string;
  toneClass: string;
  animationDelayMs: number;
  animationDurationMs: number;
  visual: ReactNode;
  phase?: string;
  payoff?: boolean;
};

type ConfettiParticle = {
  x: string;
  y: string;
  rotate: string;
  delay: string;
  width: string;
  height: string;
  color: string;
};

const CONFETTI_RESET_DELAY_MS = 1600;
const CONFETTI_TRIGGER_PROGRESS = 0.74;

const CONFETTI_PARTICLES: ConfettiParticle[] = [
  { x: "-192px", y: "-116px", rotate: "-56deg", delay: "0ms", width: "18px", height: "6px", color: "rgba(226, 189, 116, 0.98)" },
  { x: "-168px", y: "-186px", rotate: "-34deg", delay: "40ms", width: "16px", height: "6px", color: "rgba(247, 244, 238, 0.96)" },
  { x: "-146px", y: "-138px", rotate: "-16deg", delay: "72ms", width: "13px", height: "13px", color: "rgba(150, 175, 196, 0.9)" },
  { x: "-122px", y: "-222px", rotate: "10deg", delay: "110ms", width: "16px", height: "5px", color: "rgba(123, 177, 148, 0.88)" },
  { x: "-96px", y: "-176px", rotate: "26deg", delay: "84ms", width: "18px", height: "6px", color: "rgba(232, 201, 138, 0.96)" },
  { x: "-72px", y: "-244px", rotate: "44deg", delay: "132ms", width: "12px", height: "12px", color: "rgba(246, 241, 232, 0.96)" },
  { x: "-36px", y: "-198px", rotate: "18deg", delay: "168ms", width: "17px", height: "6px", color: "rgba(146, 172, 194, 0.9)" },
  { x: "-12px", y: "-268px", rotate: "-8deg", delay: "124ms", width: "19px", height: "6px", color: "rgba(226, 189, 116, 0.96)" },
  { x: "18px", y: "-224px", rotate: "14deg", delay: "150ms", width: "14px", height: "14px", color: "rgba(245, 240, 233, 0.94)" },
  { x: "44px", y: "-284px", rotate: "34deg", delay: "190ms", width: "18px", height: "6px", color: "rgba(127, 155, 180, 0.9)" },
  { x: "72px", y: "-216px", rotate: "58deg", delay: "156ms", width: "16px", height: "6px", color: "rgba(226, 189, 116, 0.94)" },
  { x: "102px", y: "-248px", rotate: "24deg", delay: "214ms", width: "13px", height: "13px", color: "rgba(121, 173, 145, 0.88)" },
  { x: "132px", y: "-178px", rotate: "46deg", delay: "236ms", width: "18px", height: "6px", color: "rgba(247, 244, 238, 0.92)" },
  { x: "164px", y: "-122px", rotate: "62deg", delay: "192ms", width: "16px", height: "6px", color: "rgba(226, 189, 116, 0.9)" },
  { x: "188px", y: "-92px", rotate: "28deg", delay: "256ms", width: "14px", height: "6px", color: "rgba(150, 175, 196, 0.86)" },
  { x: "-178px", y: "-72px", rotate: "-48deg", delay: "220ms", width: "15px", height: "6px", color: "rgba(247, 244, 238, 0.88)" },
  { x: "-138px", y: "-96px", rotate: "-22deg", delay: "278ms", width: "12px", height: "12px", color: "rgba(226, 189, 116, 0.88)" },
  { x: "-94px", y: "-124px", rotate: "12deg", delay: "304ms", width: "15px", height: "6px", color: "rgba(123, 177, 148, 0.82)" },
  { x: "-46px", y: "-104px", rotate: "38deg", delay: "336ms", width: "14px", height: "6px", color: "rgba(245, 240, 233, 0.88)" },
  { x: "8px", y: "-112px", rotate: "-18deg", delay: "294ms", width: "12px", height: "12px", color: "rgba(226, 189, 116, 0.86)" },
  { x: "56px", y: "-132px", rotate: "22deg", delay: "318ms", width: "16px", height: "6px", color: "rgba(146, 172, 194, 0.84)" },
  { x: "104px", y: "-108px", rotate: "54deg", delay: "348ms", width: "14px", height: "6px", color: "rgba(247, 244, 238, 0.86)" },
  { x: "148px", y: "-142px", rotate: "18deg", delay: "372ms", width: "12px", height: "12px", color: "rgba(226, 189, 116, 0.84)" },
  { x: "178px", y: "-78px", rotate: "42deg", delay: "396ms", width: "15px", height: "6px", color: "rgba(121, 173, 145, 0.8)" },
];

const SAVING_STEPS: SavingStep[] = [
  {
    step: "01",
    title: "Define your income",
    phase: "Start with income",
    text: "Set your monthly salary and recurring income baseline first so every next decision starts from what actually comes in.",
    riseClass: styles.savingStepsRiseOne,
    toneClass: styles.savingStepsPlan,
    animationDelayMs: 0,
    animationDurationMs: 1380,
    visual: (
      <div className={`${styles.savingStepsVisual} ${styles.savingStepsIncomeVisual}`} aria-hidden="true">
        <div className={styles.savingStepsIncomeHero}>
          <span>Net monthly income</span>
          <strong>$4,850</strong>
        </div>

        <div className={styles.savingStepsIncomeSources}>
          <div className={styles.savingStepsIncomeSource}>
            <b className={`${styles.savingStepsIncomeDot} ${styles.savingStepsIncomeDotSalary}`} />
            <div className={styles.savingStepsIncomeMeta}>
              <strong>Salary</strong>
              <span>Recurring on the 1st</span>
            </div>
            <em>+$4,100</em>
          </div>

          <div className={styles.savingStepsIncomeSource}>
            <b className={`${styles.savingStepsIncomeDot} ${styles.savingStepsIncomeDotSide}`} />
            <div className={styles.savingStepsIncomeMeta}>
              <strong>Side work</strong>
              <span>Variable income</span>
            </div>
            <em>+$520</em>
          </div>

          <div className={styles.savingStepsIncomeSource}>
            <b className={`${styles.savingStepsIncomeDot} ${styles.savingStepsIncomeDotBuffer}`} />
            <div className={styles.savingStepsIncomeMeta}>
              <strong>Planning buffer</strong>
              <span>Held before spending</span>
            </div>
            <em>$230</em>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "02",
    title: "Add your transactions",
    phase: "Keep it current",
    text: "Capture purchases, transfers, and income as they happen so your balance always reflects real life.",
    riseClass: styles.savingStepsRiseTwo,
    toneClass: styles.savingStepsCapture,
    animationDelayMs: 380,
    animationDurationMs: 1440,
    visual: (
      <div className={`${styles.savingStepsVisual} ${styles.savingStepsLedgerVisual}`} aria-hidden="true">
        <div className={styles.savingStepsInputBar}>
          <div className={styles.savingStepsInputLead}>
            <b className={styles.savingStepsLedgerDotWarm} />
            <div className={styles.savingStepsInputCopy}>
              <span>Quick add</span>
              <strong>Lunch meeting</strong>
            </div>
          </div>
          <em className={`${styles.savingStepsLedgerAmount} ${styles.savingStepsLedgerAmountNegative}`}>-$18.40</em>
        </div>

        <div className={styles.savingStepsLedger}>
          <div className={styles.savingStepsLedgerItem}>
            <b className={styles.savingStepsLedgerDotWarm} />
            <div className={styles.savingStepsLedgerMeta}>
              <strong>Groceries</strong>
              <span>Today, 14:20</span>
            </div>
            <em className={`${styles.savingStepsLedgerAmount} ${styles.savingStepsLedgerAmountNegative}`}>-$42.00</em>
          </div>

          <div className={styles.savingStepsLedgerItem}>
            <b className={styles.savingStepsLedgerDotCool} />
            <div className={styles.savingStepsLedgerMeta}>
              <strong>Salary</strong>
              <span>Auto-synced this morning</span>
            </div>
            <em className={`${styles.savingStepsLedgerAmount} ${styles.savingStepsLedgerAmountPositive}`}>+$620.00</em>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "03",
    title: "We organize your activity",
    phase: "Spot the pattern",
    text: "Transactions are grouped into categories, recurring bills, and routines so the signal is easier to understand at a glance.",
    riseClass: styles.savingStepsRiseThree,
    toneClass: styles.savingStepsOrganize,
    animationDelayMs: 760,
    animationDurationMs: 1500,
    visual: (
      <div className={`${styles.savingStepsVisual} ${styles.savingStepsOrganizeVisual}`} aria-hidden="true">
        <div className={styles.savingStepsOrganizeGrid}>
          <div className={styles.savingStepsOrganizeRow}>
            <div className={styles.savingStepsOrganizeItems}>
              <span>Market</span>
              <span>Bakery</span>
            </div>
            <div className={styles.savingStepsOrganizeResult}>
              <span>Category</span>
              <strong>Groceries</strong>
            </div>
          </div>

          <div className={styles.savingStepsOrganizeRow}>
            <div className={styles.savingStepsOrganizeItems}>
              <span>Rent</span>
              <span>Electric</span>
            </div>
            <div className={styles.savingStepsOrganizeResult}>
              <span>Recurring</span>
              <strong>Monthly bills</strong>
            </div>
          </div>

          <div className={styles.savingStepsOrganizeRow}>
            <div className={styles.savingStepsOrganizeItems}>
              <span>Coffee 8:07</span>
              <span>Coffee 8:12</span>
            </div>
            <div className={styles.savingStepsOrganizeResult}>
              <span>Routine</span>
              <strong>Morning coffee</strong>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    step: "04",
    title: "See what stays safe to spend",
    phase: "Arrive with clarity",
    text: "See the amount you can use confidently once bills, savings, and your next transfer are already protected.",
    riseClass: styles.savingStepsRiseFour,
    toneClass: styles.savingStepsResult,
    animationDelayMs: 1140,
    animationDurationMs: 1760,
    payoff: true,
    visual: (
      <div className={`${styles.savingStepsVisual} ${styles.savingStepsResultVisual}`} aria-hidden="true">
        <div className={styles.savingStepsResultHero}>
          <span>Safe to spend now</span>
          <strong>$420</strong>
          <p>available before next payday</p>
        </div>

        <div className={styles.savingStepsResultSavedCallout}>
          <span>Saved this month</span>
          <strong>+$180</strong>
        </div>

        <div className={styles.savingStepsResultProtectionGrid}>
          <div className={styles.savingStepsResultTile}>
            <span>Bills covered</span>
            <strong>$1,260</strong>
          </div>

          <div className={styles.savingStepsResultTile}>
            <span>Savings protected</span>
            <strong>$180</strong>
          </div>
        </div>

        <div className={styles.savingStepsResultTransfer}>
          <span>Next transfer already queued</span>
          <strong>$80 Friday</strong>
        </div>

        <div className={styles.savingStepsResultAllocation}>
          <i className={styles.savingStepsResultAllocationBills} />
          <i className={styles.savingStepsResultAllocationSafe} />
          <i className={styles.savingStepsResultAllocationSaved} />
        </div>

        <div className={styles.savingStepsResultLegend}>
          <span>Protected</span>
          <span>Flexible</span>
          <span>Saved</span>
        </div>
      </div>
    ),
  },
];

const PAYOFF_TIMING = SAVING_STEPS.find((step) => step.payoff);
const CONFETTI_TRIGGER_DELAY_MS = PAYOFF_TIMING
  ? PAYOFF_TIMING.animationDelayMs + Math.round(PAYOFF_TIMING.animationDurationMs * CONFETTI_TRIGGER_PROGRESS)
  : 0;

export default function LandingHowItWorksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const confettiTriggerTimeoutRef = useRef<number | null>(null);
  const confettiResetTimeoutRef = useRef<number | null>(null);
  const hasCelebratedRef = useRef(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const node = sectionRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsSectionVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsSectionVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -2% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (confettiTriggerTimeoutRef.current !== null) {
        window.clearTimeout(confettiTriggerTimeoutRef.current);
      }

      if (confettiResetTimeoutRef.current !== null) {
        window.clearTimeout(confettiResetTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isSectionVisible || hasCelebratedRef.current) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    hasCelebratedRef.current = true;
    confettiTriggerTimeoutRef.current = window.setTimeout(() => {
      setIsConfettiActive(true);

      if (confettiResetTimeoutRef.current !== null) {
        window.clearTimeout(confettiResetTimeoutRef.current);
      }

      confettiResetTimeoutRef.current = window.setTimeout(() => {
        setIsConfettiActive(false);
      }, CONFETTI_RESET_DELAY_MS);
    }, CONFETTI_TRIGGER_DELAY_MS);

    return () => {
      if (confettiTriggerTimeoutRef.current !== null) {
        window.clearTimeout(confettiTriggerTimeoutRef.current);
      }

      if (confettiResetTimeoutRef.current !== null) {
        window.clearTimeout(confettiResetTimeoutRef.current);
      }
    };
  }, [isSectionVisible]);

  return (
    <section
      ref={sectionRef}
      className={styles.savingStepsSection}
      aria-labelledby="saving-steps-title"
    >
      <div className={`${styles.savingStepsShell} ${isSectionVisible ? styles.savingStepsRevealed : ""}`}>
        <div className={styles.savingStepsHeader}>
          <span className={styles.savingStepsEyebrow}>How it works</span>
          <h2 id="saving-steps-title" className={styles.savingStepsHeading}>
            Step by step, you move toward calmer financial control.
          </h2>
          <p className={styles.savingStepsIntro}>
            Start with income clarity, capture what moved, let the patterns organize themselves, and finish with a confident next action.
          </p>
        </div>

        <div className={styles.savingStepsGrid}>
          {SAVING_STEPS.map(
            ({
              step,
              title,
              text,
              phase,
              riseClass,
              toneClass,
              animationDelayMs,
              animationDurationMs,
              payoff,
              visual,
            }) => (
            <div
              key={step}
              className={`${styles.savingStepsCardSlot} ${riseClass} ${payoff ? styles.savingStepsCardSlotPayoff : ""}`}
              style={
                {
                  "--saving-steps-delay": `${animationDelayMs}ms`,
                  "--saving-steps-duration": `${animationDurationMs}ms`,
                } as CSSProperties
              }
            >
              <article className={`${styles.savingStepsCard} ${toneClass} ${payoff ? styles.savingStepsCardPayoff : ""}`}>
                {payoff ? (
                  <div
                    className={`${styles.savingStepsConfetti} ${isConfettiActive ? styles.savingStepsConfettiActive : ""}`}
                    aria-hidden="true"
                  >
                    {CONFETTI_PARTICLES.map((particle, index) => (
                      <span
                        key={`${step}-confetti-${index}`}
                        className={styles.savingStepsConfettiParticle}
                        style={
                          {
                            "--saving-steps-confetti-x": particle.x,
                            "--saving-steps-confetti-y": particle.y,
                            "--saving-steps-confetti-rotate": particle.rotate,
                            "--saving-steps-confetti-delay": particle.delay,
                            "--saving-steps-confetti-width": particle.width,
                            "--saving-steps-confetti-height": particle.height,
                            "--saving-steps-confetti-color": particle.color,
                          } as CSSProperties
                        }
                      />
                    ))}
                  </div>
                ) : null}

                <div className={styles.savingStepsTop}>
                  <span className={styles.savingStepsStep}>{step}</span>
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
    </section>
  );
}
