import type { ReactNode } from "react";

import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/layout/Navbar";

interface StaticPageShellProps {
  children: ReactNode;
}

export default function StaticPageShell({ children }: StaticPageShellProps) {
  return (
    <>
      <Navbar />
      {children}
      <LandingFooter />
    </>
  );
}
