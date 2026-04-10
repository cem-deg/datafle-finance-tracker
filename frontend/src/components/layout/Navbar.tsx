"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Menu, Moon, Sun, TrendingUp, X } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import { APP_NAME } from "@/utils/constants";

import styles from "./Navbar.module.css";

const NAV_ITEMS = [
  { label: "Features", href: "/#features" },
  { label: "Product", href: "/#product" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/faq" },
] as const;

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const themeLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  const panelStateClassName = menuClosing ? styles.isClosing : "";

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
    }, 320);
  }, [menuClosing, menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

    return () => {
      body.style.overflow = "";
      html.style.overflow = "";
      body.classList.remove("mobile-menu-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setMenuOpen(false);
        setMenuClosing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [closeMenu, menuOpen]);

  return (
    <>
      <header className={styles.shell}>
        <nav
          className={[
            styles.navbar,
            isScrolled ? styles.navbarScrolled : "",
            menuOpen ? styles.navbarMenuOpen : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label="Primary navigation"
        >
          <div className={styles.leftCluster}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoMark} aria-hidden="true">
                <TrendingUp size={17} strokeWidth={2.1} />
              </span>
              <span className={styles.logoCopy}>
                <strong>{APP_NAME}</strong>
              </span>
            </Link>

            <div className={styles.desktopLinks} aria-label="Landing page sections">
              {NAV_ITEMS.map((item) => (
                <Link key={item.label} href={item.href} className={styles.navLink}>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.iconButton}
              onClick={toggleTheme}
              title={themeLabel}
              aria-label={themeLabel}
              type="button"
            >
              {theme === "dark" ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
            </button>

            <Link href="/login" className={styles.signInLink}>
              Sign In
            </Link>

            <Link href="/register" className={styles.ctaButton}>
              <span>Get Started</span>
            </Link>

            <button
              className={styles.menuButton}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
              type="button"
            >
              {menuOpen ? <X size={18} strokeWidth={2.2} /> : <Menu size={18} strokeWidth={2.2} />}
            </button>
          </div>
        </nav>
      </header>

      {menuOpen ? (
        <>
          <button
            className={[styles.overlay, panelStateClassName].filter(Boolean).join(" ")}
            onClick={closeMenu}
            aria-label="Close navigation menu"
            type="button"
          />

          <aside
            className={[styles.mobilePanel, panelStateClassName].filter(Boolean).join(" ")}
            id="landing-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className={styles.mobilePanelHeader}>
              <span className={styles.mobileEyebrow}>Navigation</span>
              <button
                className={styles.iconButton}
                onClick={closeMenu}
                aria-label="Close navigation menu"
                type="button"
              >
                <X size={17} strokeWidth={2.2} />
              </button>
            </div>

            <div className={styles.mobileBrand}>
              <span className={styles.mobileBrandMark} aria-hidden="true">
                <TrendingUp size={18} strokeWidth={2.1} />
              </span>
              <div>
                <strong>{APP_NAME}</strong>
                <p>Track cash flow, budgets, and momentum with a calmer finance workspace.</p>
              </div>
            </div>

            <div className={styles.mobileLinks}>
              {NAV_ITEMS.map((item, index) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.mobileLink}
                  style={{ "--nav-delay": `${index * 40}ms` } as CSSProperties}
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className={styles.mobileFooter}>
              <div className={styles.mobileUtilities}>
                <button
                  className={styles.mobileThemeButton}
                  onClick={toggleTheme}
                  aria-label={themeLabel}
                  type="button"
                >
                  {theme === "dark" ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
                  <span>{theme === "dark" ? "Light appearance" : "Dark appearance"}</span>
                </button>
                <Link href="/login" className={styles.mobileSignIn} onClick={closeMenu}>
                  Sign In
                </Link>
              </div>

              <Link href="/register" className={styles.mobileCta} onClick={closeMenu}>
                <span>Get Started</span>
              </Link>
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
