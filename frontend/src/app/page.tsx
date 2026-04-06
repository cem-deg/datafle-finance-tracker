"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LandingPageContent from "@/components/landing/LandingPageContent";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isLoading || user) return null;

  const heroParallax = Math.min(scrollY * 0.12, 28);
  const mockupParallax = Math.min(scrollY * 0.08, 24);

  return <LandingPageContent heroParallax={heroParallax} mockupParallax={mockupParallax} />;
}
