"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DemoBanner from "./DemoBanner";

interface DashboardShellProps {
  mode: "public" | "admin";
  onContactClick?: () => void;
  onLogout?: () => void;
  children: ReactNode;
}

export default function DashboardShell({
  mode,
  onContactClick,
  onLogout,
  children,
}: DashboardShellProps) {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {mode === "public" && <DemoBanner />}
        <TopBar
          mode={mode}
          onContactClick={onContactClick}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
