"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { APP_NAME } from "@/utils/constants";
import { TrendingUp, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);

  const openMenu = useCallback(() => {
    setMenuClosing(false);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    if (!menuOpen || menuClosing) {
      return;
    }

    setMenuClosing(true);
    window.setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 300);
  }, [menuClosing, menuOpen]);

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (menuOpen) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      body.classList.add("mobile-menu-open");
    } else {
      body.style.overflow = "";
      html.style.overflow = "";
      body.classList.remove("mobile-menu-open");
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      body.style.overflow = "";
      html.style.overflow = "";
      body.classList.remove("mobile-menu-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeMenu, menuOpen]);

  return (
    <>
      <nav className={`landing-navbar ${menuOpen ? "menu-open" : ""}`} id="landing-navbar">
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
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme" id="theme-toggle-nav" aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/login" className="btn btn-ghost btn-sm nav-signin">Sign In</Link>
          <Link href="/register" className="btn btn-primary btn-sm nav-start">Get Started</Link>
          <button
            className={`hamburger-btn ${menuOpen ? "is-open" : ""}`}
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
          >
            <span className="hamburger-icon" aria-hidden="true">
              <span className="hamburger-line line-top" />
              <span className="hamburger-line line-middle" />
              <span className="hamburger-line line-bottom" />
            </span>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className={`mobile-menu-overlay ${menuClosing ? "is-closing" : ""}`} onClick={closeMenu} />
          <div className={`mobile-menu ${menuClosing ? "is-closing" : ""}`} id="landing-mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <Link href="/#features" className="nav-link" onClick={closeMenu}>Features</Link>
            <Link href="/#product" className="nav-link" onClick={closeMenu}>Product</Link>
            <Link href="/#pricing" className="nav-link" onClick={closeMenu}>Pricing</Link>
            <Link href="/faq" className="nav-link" onClick={closeMenu}>FAQ</Link>
            <hr className="mobile-divider" />
            <Link href="/login" className="nav-link" onClick={closeMenu}>Sign In</Link>
            <Link href="/register" className="btn btn-primary" onClick={closeMenu} style={{ textAlign: "center" }}>Get Started</Link>
            <button className="theme-toggle" onClick={toggleTheme} style={{ alignSelf: "flex-start", marginTop: "var(--space-sm)" }} aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </>
      )}
    </>
  );
}
