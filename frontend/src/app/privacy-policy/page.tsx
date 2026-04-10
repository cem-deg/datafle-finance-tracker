import StaticInfoPage from "@/components/static/StaticInfoPage";

const SECTIONS = [
  {
    title: "Information we may collect",
    paragraphs: [
      "Datafle is built around personal finance workflows, so the service may process account profile details, authentication data, and the financial records you choose to add to the product.",
      "We may also process limited technical information needed to keep the service secure, available, and reliable across devices and regions.",
    ],
  },
  {
    title: "How information is used",
    paragraphs: [
      "Information is used to operate the product, secure user accounts, support product functionality, and improve clarity, performance, and reliability over time.",
    ],
    bullets: [
      "Provide account access and core budgeting or tracking features",
      "Maintain security, fraud prevention, and service integrity",
      "Improve product quality and understand feature performance",
    ],
  },
  {
    title: "User choice and regional privacy rights",
    paragraphs: [
      "Datafle is intended for global users, including users in the United States and Europe. Access, correction, deletion, and other privacy requests may vary depending on local law and product maturity.",
      "As the service expands, this page should be reviewed and finalized with legal counsel before production use.",
    ],
  },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <StaticInfoPage
      eyebrow="Privacy"
      title="Privacy-first by design."
      intro="This page outlines a high-level privacy posture for Datafle and is intended as a clear product-facing draft until a full legal review is completed."
      sections={[...SECTIONS]}
      secondaryCta={{ label: "Contact", href: "/contact" }}
      note="This policy is a starter draft for product completeness and should be finalized with legal review before launch."
    />
  );
}
