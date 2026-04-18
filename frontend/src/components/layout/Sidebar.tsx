"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/context/CurrencyContext";
import { NAV_ITEMS, APP_NAME } from "@/utils/constants";
import {
  LayoutDashboard, Wallet, BarChart3, Lightbulb, Tags,
  LogOut, TrendingUp, Sun, Moon, Settings, ChevronDown,
  Calendar, Globe,
  Banknote, Target,
} from "lucide-react";
import ModalShell from "@/components/ui/ModalShell";
import styles from "./Sidebar.module.css";

const iconMap: Record<string, React.ReactNode> = {
  "layout-dashboard": <LayoutDashboard size={20} />,
  wallet: <Wallet size={20} />,
  banknote: <Banknote size={20} />,
  target: <Target size={20} />,
  "bar-chart-3": <BarChart3 size={20} />,
  lightbulb: <Lightbulb size={20} />,
  tags: <Tags size={20} />,
};

const currencyMarks: Record<string, string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
  GBP: "£",
  JPY: "¥",
  KRW: "₩",
  CAD: "C$",
  AUD: "A$",
  CHF: "Fr",
  INR: "₹",
  BRL: "R$",
  MXN: "M$",
  SEK: "Skr",
  NOK: "Nkr",
  PLN: "zł",
  AED: "دإ",
  SAR: "SR",
  RUB: "₽",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";

  return (
    <>
      <aside className="sidebar" id="sidebar">
        <div className="sidebar-logo">
          <div className={styles.logoIcon}><TrendingUp size={18} /></div>
          <h1>{APP_NAME}</h1>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.sidebarLink} ${isActive ? styles.active : ""}`.trim()}
              >
                {iconMap[item.icon]}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className={styles.themeToggleWrap}>
          <button className="theme-toggle btn-full" onClick={toggleTheme} title="Toggle theme" id="theme-toggle-sidebar" type="button">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Profile Section */}
        <div className="sidebar-footer">
          <div className={styles.profilePanel}>
            <button
              className={`${styles.sidebarUser} ${styles.profileTrigger}`}
              onClick={() => setProfileExpanded(!profileExpanded)}
              type="button"
              aria-expanded={profileExpanded}
              aria-controls="sidebar-profile-details"
            >
              <div className={styles.avatar}>{initial}</div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user?.name || "User"}</div>
                <div className={styles.userEmail}>{user?.email || ""}</div>
              </div>
              <ChevronDown
                size={16}
                className={`${styles.profileChevron} ${profileExpanded ? styles.profileChevronOpen : ""}`.trim()}
              />
            </button>

            {profileExpanded && (
              <div className={styles.profileExpanded} id="sidebar-profile-details">
                <div className={styles.profileDetail}>
                  <Calendar size={14} />
                  <span>Member since {memberSince}</span>
                </div>
                <div className={styles.profileDetail}>
                  <Globe size={14} />
                  <span>{currency.flag} {currency.code}</span>
                </div>
                <div className={styles.profileActions}>
                  <button
                    className="btn btn-ghost btn-sm btn-equal"
                    onClick={() => setShowSettings(true)}
                    type="button"
                  >
                    <Settings size={14} /> Settings
                  </button>
                  <button
                    className="btn btn-ghost btn-sm btn-equal btn-danger-ghost"
                    onClick={logout}
                    id="logout-btn"
                    type="button"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettings && (
        <ModalShell title="Settings" onClose={() => setShowSettings(false)}>
          <div className={styles.settingsSection}>
            <h3>Currency</h3>
            <p className={styles.settingsHelp}>
              Select your preferred currency for displaying amounts
            </p>
            <div className={styles.currencyGrid}>
              {SUPPORTED_CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  className={`${styles.currencyOption} ${currency.code === c.code ? styles.currencyOptionSelected : ""}`.trim()}
                  onClick={() => setCurrency(c.code)}
                  aria-pressed={currency.code === c.code}
                >
                  <span className={styles.currencyMark} aria-hidden="true">
                    {currencyMarks[c.code] ?? c.symbol}
                  </span>
                  <span className={styles.currencyMeta}>
                    <span className={styles.currencyCode}>{c.code}</span>
                    <span className={styles.currencyFlag}>{c.flag}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.settingsSection}>
            <h3>Theme</h3>
            <div className={styles.settingsThemeRow}>
              <button
                className={`btn btn-equal ${theme === "dark" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => { if (theme !== "dark") toggleTheme(); }}
                type="button"
              >
                <Moon size={16} /> Dark
              </button>
              <button
                className={`btn btn-equal ${theme === "light" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => { if (theme !== "light") toggleTheme(); }}
                type="button"
              >
                <Sun size={16} /> Light
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </>
  );
}
