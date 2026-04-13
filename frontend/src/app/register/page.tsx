"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthScreen from "@/components/auth/AuthScreen";
import styles from "@/components/auth/AuthScreen.module.css";
import { APP_NAME } from "@/utils/constants";

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
    <AuthScreen
      kicker="Open your workspace"
      panelTitle="Start with a tighter personal finance workspace."
      panelDescription="Create your account and move into the same compact product surface for spending review, budget attention, and monthly clarity."
      formTitle="Create an account"
      formDescription={`Create your ${APP_NAME} account`}
      switchPrompt="Already have an account?"
      switchHref="/login"
      switchLabel="Sign in"
      providerAction="Sign up"
      error={error}
      errorId="register-error"
      metrics={[
        { value: "Income", label: "tracking" },
        { value: "Expenses", label: "review" },
        { value: "Budgets", label: "focus" },
      ]}
      highlights={[
        {
          title: "Keep money flow together",
          description: "Bring income, expenses, budgets, and analytics into one structured place from day one.",
        },
        {
          title: "Build habits around clarity",
          description: "The product is organized to help you understand spending and spot what needs attention faster.",
        },
        {
          title: "Use the same auth path",
          description: "This update changes presentation only. Registration logic and routing remain intact.",
        },
      ]}
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="name">
              Full Name
            </label>
            <span className={styles.helper}>Displayed in your workspace</span>
          </div>
          <input
            id="name"
            type="text"
            className={styles.input}
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "register-error" : undefined}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="reg-email">
              Email
            </label>
            <span className={styles.helper}>m@example.com</span>
          </div>
          <input
            id="reg-email"
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "register-error" : undefined}
            required
          />
        </div>

        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label} htmlFor="reg-password">
              Password
            </label>
            <span className={styles.helper}>Minimum 6 characters</span>
          </div>
          <input
            id="reg-password"
            type="password"
            className={styles.input}
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "register-error" : undefined}
          />
        </div>

        <button
          type="submit"
          className={styles.primaryButton}
          id="register-submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
    </AuthScreen>
  );
}
