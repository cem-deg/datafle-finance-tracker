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
          <div className="logo-icon nav-logo-icon">
            <TrendingUp size={18} />
          </div>
          <div className="nav-brand-copy">
            <h1>{APP_NAME}</h1>
            <span>Finance workspace</span>
          </div>
        </Link>

        <div className="nav-links nav-pill-links">
          <Link href="/#features" className="nav-link">Features</Link>
          <Link href="/#product" className="nav-link">Product</Link>
          <Link href="/#pricing" className="nav-link">Pricing</Link>
          <Link href="/faq" className="nav-link">FAQ</Link>
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" id="theme-toggle-nav">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login" className="btn btn-ghost btn-sm nav-signin">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm nav-start">Get Started</Link>
          <button className="hamburger-btn" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <div>
                <h2>Menu</h2>
                <p>Navigate the product surface</p>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setMenuOpen(false)}><X size={20} /></button>
            </div>
            <Link href="/#features" className="nav-link" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/#product" className="nav-link" onClick={() => setMenuOpen(false)}>Product</Link>
            <Link href="/#pricing" className="nav-link" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/faq" className="nav-link" onClick={() => setMenuOpen(false)}>FAQ</Link>
            <hr className="mobile-divider" />
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
