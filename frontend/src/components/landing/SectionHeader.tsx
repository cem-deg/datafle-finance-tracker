import styles from "./LandingPage.module.css";

interface SectionHeaderProps {
  title: string;
  description: string;
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className={styles.sectionHeader}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
