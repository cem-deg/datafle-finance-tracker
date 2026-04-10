import StaticInfoPage from "@/components/static/StaticInfoPage";

const SECTIONS = [
  {
    title: "Using the service",
    paragraphs: [
      "By creating an account or using Datafle, users agree to use the service responsibly and in ways that do not harm the product, other users, or the integrity of the platform.",
    ],
    bullets: [
      "Keep account credentials secure",
      "Provide accurate information when using the service",
      "Avoid misuse, abuse, reverse engineering, or unlawful activity",
    ],
  },
  {
    title: "Availability and changes",
    paragraphs: [
      "Datafle may change, improve, pause, or discontinue features as the product evolves. Pricing, feature access, and plan structure may also change over time with reasonable notice when appropriate.",
    ],
  },
  {
    title: "Important product limits",
    paragraphs: [
      "Datafle is a personal finance product, not financial, tax, or legal advice. Users remain responsible for their own decisions, records, and compliance obligations.",
      "These terms are presented as a product-ready draft and should be finalized before public commercial release.",
    ],
  },
] as const;

export default function TermsOfServicePage() {
  return (
    <StaticInfoPage
      eyebrow="Terms"
      title="Simple terms for a clear product."
      intro="These terms summarize how Datafle is intended to be used today and provide a lightweight foundation until final launch terms are approved."
      sections={[...SECTIONS]}
      secondaryCta={{ label: "Privacy policy", href: "/privacy-policy" }}
      note="This is a draft terms page and not a substitute for final legal terms."
    />
  );
}
