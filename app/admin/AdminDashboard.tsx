"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import MetricCards from "@/components/dashboard/MetricCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AdminLeadsTable from "@/components/dashboard/AdminLeadsTable";
import TasksSidebar from "@/components/dashboard/TasksSidebar";
import { ToastContainer, useToasts } from "@/components/ui/Toast";
import { Calendar } from "lucide-react";
import type { Lead } from "@/lib/types";

interface AdminDashboardProps {
  initialLeads: Lead[];
}

export default function AdminDashboard({ initialLeads }: AdminDashboardProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const { toasts, addToast, dismissToast } = useToasts();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }, [router]);

  const handleStatusChange = useCallback(
    async (id: string, newStatus: Lead["status"]) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus, read: true })
        .eq("id", id);

      if (error) {
        addToast("Failed to update status");
        return;
      }

      setLeads((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, status: newStatus, read: true } : l
        )
      );
      addToast(`Status updated to ${newStatus}`);
    },
    [addToast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const lead = leads.find((l) => l.id === id);
      const supabase = createClient();
      const { error } = await supabase.from("leads").delete().eq("id", id);

      if (error) {
        addToast("Failed to delete lead");
        return;
      }

      setLeads((prev) => prev.filter((l) => l.id !== id));
      addToast(`${lead?.name ?? "Lead"} deleted`);
    },
    [leads, addToast]
  );

  return (
    <>
      <DashboardShell mode="admin" onLogout={handleLogout}>
        <div className="flex">
          {/* Primary content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-on-surface tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-on-surface/50 mt-0.5">
                  Real leads & pipeline management
                </p>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface/70 hover:bg-surface-high transition-colors">
                <Calendar size={14} />
                Mar 21 — Mar 28
              </button>
            </div>

            <MetricCards />

            {/* Revenue chart + Admin leads table */}
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <RevenueChart />
              </div>
              <div className="col-span-3">
                <AdminLeadsTable
                  leads={leads}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>

          {/* Task sidebar */}
          <TasksSidebar
            onTaskComplete={(title) => addToast(`"${title}" completed`)}
          />
        </div>
      </DashboardShell>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
