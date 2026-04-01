"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { APP_NAME } from "@/utils/constants";
import { TrendingUp, Sun, Moon, Menu, X } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="landing-navbar" id="landing-navbar">
        <Link href="/" className="nav-logo">
          <div className="logo-icon" style={{ width: 32, height: 32, background: "var(--gradient-primary)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <TrendingUp size={18} />
          </div>
          <h1>{APP_NAME}</h1>
        </Link>

        <div className="nav-links">
          <Link href="/#features" className="nav-link">Features</Link>
          <Link href="/#how-it-works" className="nav-link">How It Works</Link>
          <Link href="/faq" className="nav-link">FAQ</Link>
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" id="theme-toggle-nav">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm" style={{ display: "inline-flex" }}>Get Started</Link>
          <button className="hamburger-btn" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-menu">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
              <h2 style={{ fontSize: "var(--font-lg)", fontWeight: 700 }}>Menu</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            </div>
            <Link href="/#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/#how-it-works" className="nav-link" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link href="/faq" className="nav-link" onClick={() => setMenuOpen(false)}>FAQ</Link>
            <hr style={{ border: "none", borderTop: "1px solid var(--glass-border)", margin: "var(--space-sm) 0" }} />
            <Link href="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)} style={{ textAlign: "center" }}>Get Started</Link>
            <button className="theme-toggle" onClick={toggleTheme} style={{ alignSelf: "flex-start", marginTop: "var(--space-sm)" }}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </>
      )}
    </>
  );
}
