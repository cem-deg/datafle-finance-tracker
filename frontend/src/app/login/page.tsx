"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/ui/FormField";
import InlineMessage from "@/components/ui/InlineMessage";
import { APP_NAME } from "@/utils/constants";
import { ArrowLeft, Lock, Mail, Shield, TrendingUp, Wallet } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page premium-auth-page">
      <div className="auth-shell">
        <div className="auth-brand-panel auth-editorial-panel auth-brand-panel-primary animate-in">
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
                <p>Welcome back to your financial workspace.</p>
              </div>
            </div>

            <p className="section-kicker auth-kicker">Private workspace access</p>
            <h2>Sign in to return to a cleaner, more deliberate finance workflow.</h2>
            <p className="auth-brand-text">
              Built for clarity across budgets, cashflow, and decision-making. The experience stays polished from the first screen to the dashboard.
            </p>
          </div>

          <div className="auth-editorial-grid">
            <article className="auth-editorial-card">
              <span>Workspace</span>
              <strong>Income, expenses, and budgets in one place</strong>
              <p>A more composed surface for daily financial control.</p>
            </article>
            <article className="auth-editorial-card">
              <span>Security</span>
              <strong>Private access with structured auth flow</strong>
              <p>Your financial data stays behind a dedicated account layer.</p>
            </article>
          </div>

          <div className="auth-editorial-footer">
            <div className="auth-inline-metric">
              <Wallet size={16} />
              Clear overview, lower friction
            </div>
            <div className="auth-inline-metric">
              <Shield size={16} />
              Built with production in mind
            </div>
          </div>
        </div>

        <div className="auth-card premium-auth-card auth-form-panel animate-in animate-in-delay-2">
          <div className="auth-logo">
            <h1>Sign In</h1>
            <p>Access your dashboard, budgets, and cashflow overview.</p>
          </div>

          {error ? (
            <InlineMessage
              message={error}
              className="auth-error"
              id="login-error"
            />
          ) : null}

          <form className="auth-form form-shell" onSubmit={handleSubmit}>
            <FormField
              label="Email"
              htmlFor="email"
              help="Use the email address tied to your finance workspace."
              helpId="login-email-help"
            >
              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="email"
                  type="email"
                  className="form-input auth-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-email-help login-error" : "login-email-help"}
                  required
                />
              </div>
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              help="Enter the password you use to access your account."
              helpId="login-password-help"
            >
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="password"
                  type="password"
                  className="form-input auth-input"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "login-password-help login-error" : "login-password-help"}
                  required
                />
              </div>
            </FormField>

            <button type="submit" className="btn btn-primary auth-submit" id="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link href="/register">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
