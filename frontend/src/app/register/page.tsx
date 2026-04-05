"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { APP_NAME } from "@/utils/constants";
import { ArrowLeft, Lock, Mail, Target, TrendingUp, User, Wallet } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(email, name, password);
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page premium-auth-page">
      <div className="auth-shell">
        <div className="auth-brand-panel auth-editorial-panel animate-in">
          <Link href="/" className="auth-back-link">
            <ArrowLeft size={16} />
            Back to landing page
          </Link>

          <div className="auth-brand-block">
            <div className="auth-logo auth-logo-left">
              <div className="logo-icon auth-brand-icon">
                <TrendingUp size={22} />
              </div>
              <div className="auth-brand-lockup">
                <h1>{APP_NAME}</h1>
                <p>Create your workspace and shape your money flow.</p>
              </div>
            </div>

            <p className="section-kicker auth-kicker">Open your workspace</p>
            <h2>Start with a product surface that feels more refined from day one.</h2>
            <p className="auth-brand-text">
              Set up your account and move directly into a more intentional finance workflow across income, spending, and budgets.
            </p>
          </div>

          <div className="auth-editorial-grid">
            <article className="auth-editorial-card">
              <span>Control</span>
              <strong>Track the full money flow in one structured space</strong>
              <p>Start with a clearer system instead of scattered notes and spreadsheets.</p>
            </article>
            <article className="auth-editorial-card">
              <span>Direction</span>
              <strong>Build habits inside a product designed for clarity</strong>
              <p>Every surface is tuned to feel deliberate, composed, and easier to trust.</p>
            </article>
          </div>

          <div className="auth-editorial-footer">
            <div className="auth-inline-metric">
              <Target size={16} />
              Stronger planning and budget discipline
            </div>
            <div className="auth-inline-metric">
              <Wallet size={16} />
              One place for your financial system
            </div>
          </div>
        </div>

        <div className="auth-card premium-auth-card animate-in animate-in-delay-2">
          <div className="auth-logo">
            <h1>Create Account</h1>
            <p>Open your workspace and start building your financial system.</p>
          </div>

          {error && <div className="auth-error" id="register-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="auth-input-wrap">
                <User size={18} className="auth-input-icon" />
                <input
                  id="name"
                  type="text"
                  className="form-input auth-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  className="form-input auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="reg-password"
                  type="password"
                  className="form-input auth-input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" id="register-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{" "}
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
