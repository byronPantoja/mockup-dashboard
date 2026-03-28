"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { DEMO_LEADS } from "@/lib/seed-data";
import type { DemoLead, DemoSortField, DemoStatus, SortDir } from "@/lib/types";

export default function LeadsTable({
  onAction,
}: {
  onAction?: (lead: DemoLead, action: string) => void;
}) {
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<DemoStatus>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = useCallback(() => {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"));
  }, []);

  const filtered =
    statusFilter === "All"
      ? DEMO_LEADS
      : DEMO_LEADS.filter((l) => l.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * mul;
  });

  const SortIcon = () => {
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="text-primary" />
    ) : (
      <ChevronDown size={14} className="text-primary" />
    );
  };

  return (
    <div className="rounded-2xl bg-surface-low">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-on-surface">Recent Leads</h2>
          <p className="text-xs text-on-surface/50 mt-0.5">{filtered.length} total</p>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter size={14} className="text-on-surface/30 shrink-0" />
          {(["All", "New", "Replied", "Meeting", "Closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === s
                  ? "bg-primary-container/30 text-primary"
                  : "text-on-surface/50 hover:bg-surface-high"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Contact
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Role
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Status
              </th>
              <th
                className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] cursor-pointer select-none hover:text-on-surface transition-colors"
                onClick={handleSort}
              >
                <span className="flex items-center gap-1">
                  Date <SortIcon />
                </span>
              </th>
              <th className="px-5 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((lead, i) => (
              <tr
                key={lead.id}
                className={`transition-colors hover:bg-surface-lowest/60 ${
                  i % 2 === 0 ? "" : "bg-surface-lowest/30"
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-[11px] font-semibold text-on-primary shrink-0">
                      {lead.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">{lead.name}</p>
                      <p className="text-xs text-on-surface/50">{lead.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="text-on-surface/70 text-xs">
                    {lead.role}
                  </span>
                  {lead.value && (
                    <span className="ml-2 rounded-md bg-secondary-container/50 px-1.5 py-0.5 text-[10px] font-medium text-on-secondary-container">
                      {lead.value}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-3">
                  <span className="font-mono text-xs text-on-surface/50">
                    {lead.date}
                  </span>
                </td>
                <td
                  className="px-5 py-3 relative"
                  ref={openMenuId === lead.id ? menuRef : undefined}
                >
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === lead.id ? null : lead.id)
                    }
                    className="rounded-lg p-1 text-on-surface/30 hover:text-on-surface hover:bg-surface-high transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenuId === lead.id && (
                    <div className="absolute right-4 top-10 z-20 w-44 rounded-xl bg-surface-lowest/90 backdrop-blur-[20px] py-1 shadow-ambient-lg animate-fade-in">
                      {["Mark as Replied", "Schedule Meeting", "Close Lead"].map(
                        (action) => (
                          <button
                            key={action}
                            onClick={() => {
                              setOpenMenuId(null);
                              onAction?.(lead, action);
                            }}
                            className="flex w-full items-center px-3 py-2 text-sm text-on-surface hover:bg-surface-low transition-colors"
                          >
                            {action}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
