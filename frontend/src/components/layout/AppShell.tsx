"use client";

/**
 * AppShell wraps authenticated pages with sidebar + mobile nav.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import styles from "./AppShell.module.css";

export default function AppShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className={styles.loadingShell}>
        <div className="text-center">
          <div className="skeleton mx-auto mb-md" style={{ width: 60, height: 60, borderRadius: "50%" }} />
          <div className="skeleton skeleton-text mx-auto" style={{ width: 120 }} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`${styles.appLayout} ${className}`.trim()}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
      <MobileNav />
    </div>
  );
}
