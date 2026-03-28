import { Activity, LayoutDashboard, X } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-60 bg-surface-low/80 backdrop-blur-[20px] flex flex-col
          transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0 lg:z-auto
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + mobile close */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
            <Activity size={16} className="text-on-primary" />
          </div>
          <span className="text-sm font-semibold text-on-surface tracking-tight">
            BaseLine
          </span>
          <span className="ml-auto rounded-lg bg-surface-high px-1.5 py-0.5 text-[10px] font-medium text-on-surface/50 font-mono lg:block hidden">
            v2.4
          </span>
          <button
            onClick={onClose}
            className="ml-auto rounded-xl p-1 text-on-surface/40 hover:text-on-surface hover:bg-surface-high transition-colors lg:hidden"
          >
            <X size={18} />
          </button>
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
    </>
  );
}
