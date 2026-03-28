"use client";

import { Search, Bell, ChevronDown, Plus, LogOut, Menu } from "lucide-react";

interface TopBarProps {
  mode: "public" | "admin";
  onContactClick?: () => void;
  onLogout?: () => void;
  onMenuClick?: () => void;
}

export default function TopBar({ mode, onContactClick, onLogout, onMenuClick }: TopBarProps) {
  return (
    <header className="shrink-0 flex items-center gap-2 sm:gap-4 bg-surface-lowest/80 backdrop-blur-[20px] px-3 sm:px-6 py-3">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="rounded-xl p-2 text-on-surface/40 hover:text-on-surface hover:bg-surface-low transition-colors lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-md hidden sm:block">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30" />
        <input
          type="text"
          placeholder="Search leads, companies..."
          className="w-full rounded-xl bg-surface-low py-2 pl-9 pr-16 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-surface-high px-1.5 py-0.5 text-[10px] font-mono text-on-surface/40 hidden md:inline">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-on-surface/40 hover:text-on-surface hover:bg-surface-low transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-surface-lowest" />
        </button>

        {mode === "public" ? (
          /* Contact Me CTA */
          <button
            onClick={onContactClick}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-3 sm:px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity shadow-ambient"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Contact Me</span>
          </button>
        ) : (
          /* Admin: user + logout */
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-surface-low px-3 py-1.5">
              <div className="size-7 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-[11px] font-semibold text-on-primary">
                BP
              </div>
              <span className="text-sm font-medium text-on-surface hidden sm:inline">Byron</span>
              <ChevronDown size={14} className="text-on-surface/40 hidden sm:block" />
            </div>
            <button
              onClick={onLogout}
              className="rounded-xl p-2 text-on-surface/40 hover:text-on-surface hover:bg-surface-low transition-colors"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
