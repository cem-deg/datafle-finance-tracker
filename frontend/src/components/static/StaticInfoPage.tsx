import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import { APP_NAME } from "@/utils/constants";

import styles from "./StaticInfoPage.module.css";

type StaticInfoSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

interface StaticInfoPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: readonly StaticInfoSection[];
  note?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

export default function StaticInfoPage({
  eyebrow,
  title,
  intro,
  sections,
  note,
  primaryCta,
  secondaryCta,
}: StaticInfoPageProps) {
  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.shell}>
          <section className={styles.hero}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.intro}>{intro}</p>

            {(primaryCta || secondaryCta) ? (
              <div className={styles.actions}>
                {primaryCta ? (
                  <Link href={primaryCta.href} className="btn btn-primary">
                    {primaryCta.label}
                  </Link>
                ) : null}

                {secondaryCta ? (
                  <Link href={secondaryCta.href} className="btn btn-secondary">
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </section>

          <div className={styles.sections}>
            {sections.map((section) => (
              <section key={section.title} className={styles.card}>
                <h2 className={styles.cardTitle}>{section.title}</h2>

                <div className={styles.copy}>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.bullets?.length ? (
                  <ul className={styles.list}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <footer className={styles.footer}>
            <p>
              {APP_NAME} is designed to make personal finance feel calmer, clearer, and more
              controlled.
            </p>
            {note ? <p className={styles.note}>{note}</p> : null}
          </footer>
        </div>
      </main>
    </>
  );
}
