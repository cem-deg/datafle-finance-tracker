import StaticInfoPage from "@/components/static/StaticInfoPage";

const SECTIONS = [
  {
    title: "Cookies and similar technologies",
    paragraphs: [
      "Datafle may use cookies or similar browser-side storage technologies where needed to support essential product behavior, session continuity, and user preferences.",
    ],
  },
  {
    title: "How these technologies may be used",
    paragraphs: [
      "Where used, browser storage should stay focused on functional needs rather than intrusive tracking.",
    ],
    bullets: [
      "Keep users signed in securely where applicable",
      "Remember interface or appearance preferences",
      "Support reliability, diagnostics, and performance checks",
    ],
  },
  {
    title: "User controls",
    paragraphs: [
      "Browser settings can typically be used to manage or limit cookies and similar storage. Some essential product features may not work correctly if those controls are disabled.",
      "This page is intentionally conservative and should be aligned with final implementation details before launch.",
    ],
  },
] as const;

export default function CookiePolicyPage() {
  return (
    <StaticInfoPage
      eyebrow="Cookies"
      title="Minimal by default."
      intro="This page describes a lightweight, privacy-aware approach to cookies and browser storage for Datafle."
      sections={[...SECTIONS]}
      secondaryCta={{ label: "Privacy policy", href: "/privacy-policy" }}
      note="This cookie policy should be updated alongside the production authentication and analytics setup."
    />
  );
}
