"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Trash2,
  Circle,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Lead, AdminSortField, AdminStatus, SortDir } from "@/lib/types";

const STATUS_CYCLE: Lead["status"][] = [
  "New",
  "Reviewed",
  "Contacted",
  "Archived",
];

function nextStatus(current: Lead["status"]): Lead["status"] {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface AdminLeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: Lead["status"]) => void;
  onDelete: (id: string) => void;
}

export default function AdminLeadsTable({
  leads,
  onStatusChange,
  onDelete,
}: AdminLeadsTableProps) {
  const [sortField, setSortField] = useState<AdminSortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<AdminStatus>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        expandedRef.current &&
        !expandedRef.current.contains(e.target as Node)
      ) {
        setExpandedId(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = useCallback((field: AdminSortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("desc");
      return field;
    });
  }, []);

  const filtered =
    statusFilter === "All"
      ? leads
      : leads.filter((l) => l.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "name") return a.name.localeCompare(b.name) * mul;
    return (
      (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) *
      mul
    );
  });

  const SortIcon = ({ field }: { field: AdminSortField }) => {
    if (sortField !== field)
      return <ChevronDown size={14} className="text-on-surface/20" />;
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
          <h2 className="text-sm font-semibold text-on-surface">
            Inbound Leads
          </h2>
          <p className="text-xs text-on-surface/50 mt-0.5">
            {filtered.length} total
          </p>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter size={14} className="text-on-surface/30 shrink-0" />
          {(["All", "New", "Reviewed", "Contacted", "Archived"] as const).map(
            (s) => (
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
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-5 py-3 w-4" />
              <th
                className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] cursor-pointer select-none hover:text-on-surface transition-colors"
                onClick={() => handleSort("name")}
              >
                <span className="flex items-center gap-1">
                  Contact <SortIcon field="name" />
                </span>
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Company
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Status
              </th>
              <th
                className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] cursor-pointer select-none hover:text-on-surface transition-colors"
                onClick={() => handleSort("created_at")}
              >
                <span className="flex items-center gap-1">
                  Date <SortIcon field="created_at" />
                </span>
              </th>
              <th className="px-5 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((lead, i) => (
              <>
                <tr
                  key={lead.id}
                  onClick={() =>
                    setExpandedId(expandedId === lead.id ? null : lead.id)
                  }
                  className={`transition-colors hover:bg-surface-lowest/60 cursor-pointer ${
                    i % 2 === 0 ? "" : "bg-surface-lowest/30"
                  }`}
                >
                  {/* Unread indicator */}
                  <td className="pl-5 py-3 w-4">
                    {!lead.read && (
                      <Circle
                        size={8}
                        className="text-primary fill-primary animate-pulse-dot"
                      />
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p
                        className={`font-medium text-on-surface ${
                          !lead.read ? "font-semibold" : ""
                        }`}
                      >
                        {lead.name}
                      </p>
                      <p className="text-xs text-on-surface/50">{lead.email}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-on-surface/70">
                      {lead.company ?? "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge
                      status={lead.status}
                      onClick={() =>
                        onStatusChange(lead.id, nextStatus(lead.status))
                      }
                    />
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs text-on-surface/50">
                      {formatDate(lead.created_at)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(lead.id);
                      }}
                      className="rounded-lg p-1 text-on-surface/20 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
                {expandedId === lead.id && (
                  <tr
                    key={`${lead.id}-detail`}
                    ref={expandedRef}
                    className="bg-surface-lowest/50"
                  >
                    <td colSpan={6} className="px-10 py-4 animate-fade-in">
                      {lead.role && (
                        <p className="text-xs text-on-surface/50 mb-1">
                          <span className="font-medium text-on-surface/70">
                            Role:
                          </span>{" "}
                          {lead.role}
                        </p>
                      )}
                      {lead.message ? (
                        <p className="text-sm text-on-surface/80 leading-relaxed">
                          {lead.message}
                        </p>
                      ) : (
                        <p className="text-sm text-on-surface/40 italic">
                          No message provided
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-sm text-on-surface/40"
                >
                  No leads yet — share your portfolio to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
