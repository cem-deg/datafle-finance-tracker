import StaticInfoPage from "@/components/static/StaticInfoPage";

const SECTIONS = [
  {
    title: "Product and support questions",
    paragraphs: [
      "Direct support channels have not been formally published in this project yet, so this page acts as a calm placeholder until launch-ready contact details are available.",
      "In the meantime, the FAQ is the fastest place to start for common product questions.",
    ],
  },
  {
    title: "Privacy and trust requests",
    paragraphs: [
      "Questions related to privacy, cookies, or service terms should eventually route through dedicated support or legal channels. Until those details are finalized, the linked policy pages provide the current draft posture for the product.",
    ],
  },
  {
    title: "What should be added later",
    paragraphs: [
      "Before launch, this page should be updated with real support email addresses, legal contact details, response expectations, and any region-specific information required for US or EU users.",
    ],
  },
] as const;

export default function ContactPage() {
  return (
    <StaticInfoPage
      eyebrow="Contact"
      title="We’ll keep this direct."
      intro="This contact page is a lightweight placeholder so the landing footer has a complete trust layer without sending users into broken routes."
      sections={[...SECTIONS]}
      primaryCta={{ label: "Read the FAQ", href: "/faq" }}
      secondaryCta={{ label: "Get started", href: "/register" }}
      note="Real support and legal contact details should be added here before a public launch."
    />
  );
}
