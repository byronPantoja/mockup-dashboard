"use client";

import {
  LayoutDashboard,
  GitBranch,
  Package,
  Settings,
  Activity,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: GitBranch, label: "Lead Pipeline" },
  { icon: Package, label: "Inventory" },
  { icon: Settings, label: "Settings" },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (label: string) => void;
}

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 bg-surface-low/80 backdrop-blur-[20px] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
          <Activity size={16} className="text-on-primary" />
        </div>
        <span className="text-sm font-semibold text-on-surface tracking-tight">
          BaseLine
        </span>
        <span className="ml-auto rounded-lg bg-surface-high px-1.5 py-0.5 text-[10px] font-medium text-on-surface/50 font-mono">
          v2.4
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onNavChange(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-primary-container/30 text-primary font-medium"
                  : "text-on-surface/50 hover:text-on-surface hover:bg-surface-high/50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface/40">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-pulse-dot" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          All Systems Operational
        </div>
      </div>
    </aside>
  );
}
