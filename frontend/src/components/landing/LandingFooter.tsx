import Link from "next/link";

import { APP_NAME } from "@/utils/constants";

import ScrollReveal from "./ScrollReveal";
import styles from "./LandingFooter.module.css";

const FOOTER_NAV_GROUPS = [
  {
    label: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    label: "Company",
    links: [
      { label: "About", href: "/about" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
    ],
  },
] as const;

const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Contact", href: "/contact" },
] as const;

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-labelledby="landing-footer-title">
      <ScrollReveal>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerClosing}>
              <h2 id="landing-footer-title" className={styles.footerTitle}>
                Clarity, without the noise.
              </h2>
              <p className={styles.footerSubtitle}>
                A calmer way to understand and manage your money.
              </p>
            </div>

            <Link href="/register" className={`btn btn-sm btn-primary ${styles.footerCta}`}>
              Get started
            </Link>
          </div>

          <nav className={styles.footerNav} aria-label="Footer navigation">
            {FOOTER_NAV_GROUPS.map((group) => (
              <div key={group.label} className={styles.footerNavGroup}>
                <span className={styles.footerNavLabel}>{group.label}</span>
                <div className={styles.footerNavLinks}>
                  {group.links.map((link) => (
                    <Link key={link.label} href={link.href} className={styles.footerNavLink}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className={styles.footerBottom}>
            <div className={styles.footerMeta}>
              <p className={styles.footerCopyright}>
                &copy; {year} {APP_NAME}. All rights reserved.
              </p>
              <p className={styles.footerNote}>Built for global users. Privacy-first by design.</p>
            </div>

            <div className={styles.footerLegal}>
              {FOOTER_LEGAL_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className={styles.footerLegalLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
