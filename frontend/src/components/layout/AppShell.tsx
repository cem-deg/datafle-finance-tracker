"use client";

/**
 * AppShell wraps authenticated pages with sidebar + mobile nav.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

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
      <div className="auth-page">
        <div className="text-center">
          <div className="skeleton mx-auto mb-md" style={{ width: 60, height: 60, borderRadius: "50%" }} />
          <div className="skeleton skeleton-text mx-auto" style={{ width: 120 }} />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={`app-layout ${className}`.trim()}>
      <Sidebar />
      <main className="main-content">{children}</main>
      <MobileNav />
    </div>
  );
}
