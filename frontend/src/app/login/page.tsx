"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthScreen from "@/components/auth/AuthScreen";
import styles from "@/components/auth/AuthScreen.module.css";
import { APP_NAME } from "@/utils/constants";

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
    <AuthScreen
      kicker="Secure workspace access"
      panelTitle="Track spending with a calmer, more focused workspace."
      panelDescription="Return to the same product surface built to show what you spent, where your money is going, and what needs attention next."
      formTitle="Welcome back"
      formDescription={`Login to your ${APP_NAME} account`}
      switchPrompt="Don't have an account?"
      switchHref="/register"
      switchLabel="Create one"
      providerAction="Login"
      error={error}
      errorId="login-error"
      metrics={[
        { value: "Monthly", label: "spend review" },
        { value: "Budget", label: "attention view" },
        { value: "Recent", label: "activity feed" },
      ]}
      highlights={[
        {
          title: "See spend in context",
          description: "Review monthly totals and recent expense movement in one place.",
        },
        {
          title: "Keep attention signals close",
          description: "Budgets and current pressure points stay close to the main overview.",
        },
        {
          title: "Use the same auth flow",
          description: "This update changes presentation only. Your existing login logic and routing stay intact.",
        },
      ]}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <span className={styles.helper}>m@example.com</span>
          </div>
          <input
            id="email"
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <span className={styles.helper}>Secure access</span>
          </div>
          <input
            id="password"
            type="password"
            className={styles.input}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          id="login-submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthScreen>
  );
}
