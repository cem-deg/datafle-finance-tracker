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
          <div className="logo-icon"><TrendingUp size={18} /></div>
          <h1>{APP_NAME}</h1>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? "active" : ""}`}>
                {iconMap[item.icon]}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="sidebar-theme-toggle-wrap">
          <button className="theme-toggle btn-full" onClick={toggleTheme} title="Toggle theme" id="theme-toggle-sidebar" type="button">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Profile Section */}
        <div className="sidebar-footer">
          <div className="profile-panel">
            <button
              className="sidebar-user sidebar-profile-trigger"
              onClick={() => setProfileExpanded(!profileExpanded)}
              type="button"
              aria-expanded={profileExpanded}
              aria-controls="sidebar-profile-details"
            >
              <div className="avatar">{initial}</div>
              <div className="user-info">
                <div className="user-name">{user?.name || "User"}</div>
                <div className="user-email">{user?.email || ""}</div>
              </div>
              <ChevronDown
                size={16}
                className={`sidebar-profile-chevron ${profileExpanded ? "open" : ""}`}
              />
            </button>

            {profileExpanded && (
              <div className="profile-expanded" id="sidebar-profile-details">
                <div className="profile-detail">
                  <Calendar size={14} />
                  <span>Member since {memberSince}</span>
                </div>
                <div className="profile-detail">
                  <Globe size={14} />
                  <span>{currency.flag} {currency.code}</span>
                </div>
                <div className="sidebar-profile-actions">
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
            <div className="sidebar-settings-header">
              <h2 className="modal-title" id={settingsTitleId}>Settings</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowSettings(false)} type="button" aria-label="Close settings"><X size={20} /></button>
            </div>

            <div className="settings-section">
              <h3>Currency</h3>
              <p className="settings-help">
                Select your preferred currency for displaying amounts
              </p>
              <div className="currency-grid">
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    className={`currency-option ${currency.code === c.code ? "selected" : ""}`}
                    onClick={() => setCurrency(c.code)}
                    aria-pressed={currency.code === c.code}
                  >
                    <span className="currency-flag">{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h3>Theme</h3>
              <div className="settings-theme-row">
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
