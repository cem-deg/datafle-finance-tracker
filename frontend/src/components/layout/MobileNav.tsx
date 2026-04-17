"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/utils/constants";
import {
  LayoutDashboard, Wallet, BarChart3, Lightbulb, Tags,
  Banknote, Target,
} from "lucide-react";
import styles from "./MobileNav.module.css";

const iconMap: Record<string, React.ReactNode> = {
  "layout-dashboard": <LayoutDashboard size={20} />,
  wallet: <Wallet size={20} />,
  banknote: <Banknote size={20} />,
  target: <Target size={20} />,
  "bar-chart-3": <BarChart3 size={20} />,
  lightbulb: <Lightbulb size={20} />,
  tags: <Tags size={20} />,
};

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.mobileNav} id="mobile-nav">
      <div className={styles.mobileNavInner}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === "/dashboard" || pathname === "/"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavLink} ${isActive ? styles.active : ""}`.trim()}
            >
              <div className={styles.navIconWrap}>{iconMap[item.icon]}</div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
