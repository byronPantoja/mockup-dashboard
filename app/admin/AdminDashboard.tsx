"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import AdminMetricCards from "@/components/dashboard/AdminMetricCards";
import LeadStatusChart from "@/components/dashboard/LeadStatusChart";
import AdminLeadsTable from "@/components/dashboard/AdminLeadsTable";
import { ToastContainer, useToasts } from "@/components/ui/Toast";
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
        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Page header */}
          <div>
            <h1 className="text-xl font-semibold text-on-surface tracking-tight">
              Lead Manager
            </h1>
            <p className="text-sm text-on-surface/50 mt-0.5">
              Track and organize inbound contacts
            </p>
          </div>

          <AdminMetricCards leads={leads} />

          {/* Status chart + Leads table */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <LeadStatusChart leads={leads} />
            </div>
            <div className="lg:col-span-3">
              <AdminLeadsTable
                leads={leads}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </DashboardShell>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
