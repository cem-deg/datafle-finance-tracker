"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency, SUPPORTED_CURRENCIES } from "@/context/CurrencyContext";
import { NAV_ITEMS, APP_NAME } from "@/utils/constants";
import {
  LayoutDashboard, Wallet, BarChart3, Lightbulb, Tags,
  LogOut, TrendingUp, Sun, Moon, Settings, ChevronDown,
  Calendar, Globe, X,
  Banknote, Target,
} from "lucide-react";
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

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsTitleId = useId();

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "";

  useEffect(() => {
    if (!showSettings) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSettings(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showSettings]);

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
        <div className="modal-overlay modal-overlay-elevated" onClick={() => setShowSettings(false)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={settingsTitleId}
            tabIndex={-1}
          >
            <div className={styles.settingsHeader}>
              <h2 className="modal-title" id={settingsTitleId}>Settings</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowSettings(false)} type="button" aria-label="Close settings"><X size={20} /></button>
            </div>

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
                    <span className={styles.currencyFlag}>{c.flag}</span>
                    <span>{c.code}</span>
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
          </div>
        </div>
      )}
    </>
  );
}
