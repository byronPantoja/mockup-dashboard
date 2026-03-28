import { Activity, LayoutDashboard } from "lucide-react";

export default function Sidebar() {
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
      <nav className="flex-1 px-3 py-4">
        <div className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm bg-primary-container/30 text-primary font-medium">
          <LayoutDashboard size={18} />
          Dashboard
        </div>
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
