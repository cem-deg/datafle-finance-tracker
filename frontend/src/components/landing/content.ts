export type FeatureIconKey = "overview" | "insight" | "control";
export type ValueIconKey = "signal" | "premium" | "security";

export interface FeaturePanel {
  title: string;
  description: string;
  icon: FeatureIconKey;
  accent: string;
  background: string;
}

export interface ValuePoint {
  title: string;
  text: string;
  icon: ValueIconKey;
}

export interface WorkflowStep {
  step: string;
  title: string;
  text: string;
}

export interface TrustMetric {
  value: string;
  label: string;
}

export interface SavingsJourneyItem {
  label: string;
  before: string;
  after: string;
  beforeWidth: string;
  afterWidth: string;
}

export interface PhoneActivityItem {
  label: string;
  amount: string;
  tone: "positive" | "negative";
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  points: string[];
  highlight: boolean;
}

export const FEATURE_PANELS: FeaturePanel[] = [
  {
    title: "Executive-grade overview",
    description: "Income, expenses, budgets, and balance shown in one premium command center.",
    icon: "overview",
    accent: "var(--accent-primary-light)",
    background: "rgba(124, 106, 239, 0.12)",
  },
  {
    title: "Adaptive cashflow intelligence",
    description: "Insight and prediction layers that turn raw activity into financial direction.",
    icon: "insight",
    accent: "var(--accent-secondary)",
    background: "rgba(0, 210, 211, 0.12)",
  },
  {
    title: "Built for serious control",
    description: "Monthly budgets, category precision, and fast execution without spreadsheet fatigue.",
    icon: "control",
    accent: "var(--accent-warning)",
    background: "rgba(253, 203, 110, 0.12)",
  },
];

export const VALUE_POINTS: ValuePoint[] = [
  {
    title: "Signal over clutter",
    text: "Every screen is designed to surface the numbers that matter first, with less friction and more confidence.",
    icon: "signal",
  },
  {
    title: "Premium operational feel",
    text: "Fast interactions, elegant motion, and polished surfaces create the feeling of a tool worth trusting daily.",
    icon: "premium",
  },
  {
    title: "Security-minded architecture",
    text: "JWT auth, structured services, migration flow, and a backend prepared for production-grade deployment.",
    icon: "security",
  },
];

export const WORKFLOW: WorkflowStep[] = [
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

export const TRUST_METRICS: TrustMetric[] = [
  { value: "3x", label: "stronger first-screen product impression" },
  { value: "<60s", label: "to understand balance, budgets, and spending pressure" },
  { value: "1", label: "clear workspace for income, expenses, and growth" },
];

export const READINESS_POINTS: string[] = [
  "Income, expense, and budget flows already live in one system",
  "Analytics and insights are structured for deeper product layers",
  "Migration and production planning started before scale becomes painful",
];

export const SAVINGS_JOURNEY: SavingsJourneyItem[] = [
  { label: "Month 1", before: "$180", after: "$340", beforeWidth: "24%", afterWidth: "46%" },
  { label: "Month 2", before: "$210", after: "$420", beforeWidth: "28%", afterWidth: "58%" },
  { label: "Month 3", before: "$230", after: "$520", beforeWidth: "31%", afterWidth: "71%" },
  { label: "Month 4", before: "$260", after: "$640", beforeWidth: "35%", afterWidth: "84%" },
];

export const PHONE_ACTIVITY: PhoneActivityItem[] = [
  { label: "Salary", amount: "+$3,200", tone: "positive" },
  { label: "Groceries", amount: "-$148", tone: "negative" },
  { label: "Emergency Fund", amount: "+$240", tone: "positive" },
];

export const PRICING_PLANS: PricingPlan[] = [
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
