import StaticInfoPage from "@/components/static/StaticInfoPage";

const SECTIONS = [
  {
    title: "What Datafle is building",
    paragraphs: [
      "Datafle is being shaped around a simple idea: personal finance tools should help people think more clearly, not overwhelm them with dashboards, noise, or friction.",
      "The product is designed to bring balances, budgets, spending pressure, and trend signals into one calmer workspace that feels easy to trust every day.",
    ],
  },
  {
    title: "How we approach the product",
    paragraphs: [
      "We care about simplicity, legibility, and steady confidence. That means fewer distractions, clearer signals, and product decisions that respect a user's time and attention.",
    ],
    bullets: [
      "Minimal interfaces with clear hierarchy",
      "Financial visibility without unnecessary clutter",
      "Privacy-aware product choices from the start",
    ],
  },
  {
    title: "Where this page stands today",
    paragraphs: [
      "This About page is intentionally lightweight for now and will expand as the product, team, and public launch details become more formal.",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <StaticInfoPage
      eyebrow="Company"
      title="A calmer way to understand money."
      intro="Datafle is focused on making everyday financial awareness feel more grounded, more elegant, and easier to return to."
      sections={[...SECTIONS]}
      primaryCta={{ label: "Get started", href: "/register" }}
      secondaryCta={{ label: "View pricing", href: "/#pricing" }}
      note="This page is a product placeholder and will evolve with the public company profile."
    />
  );
}
