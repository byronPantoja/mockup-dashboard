"use client";

import { useState } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import MetricCards from "@/components/dashboard/MetricCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import LeadsTable from "@/components/dashboard/LeadsTable";
import TasksSidebar from "@/components/dashboard/TasksSidebar";
import ContactModal from "@/components/ui/ContactModal";
import { ToastContainer, useToasts } from "@/components/ui/Toast";
import { Calendar } from "lucide-react";

export default function PublicDashboard() {
  const [contactOpen, setContactOpen] = useState(false);
  const { toasts, addToast, dismissToast } = useToasts();

  return (
    <>
      <DashboardShell
        mode="public"
        onContactClick={() => setContactOpen(true)}
      >
        <div className="flex">
          {/* Primary content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-on-surface tracking-tight">
                  Operations Overview
                </h1>
                <p className="text-sm text-on-surface/50 mt-0.5">
                  Real-time pipeline & performance metrics
                </p>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface/70 hover:bg-surface-high transition-colors">
                <Calendar size={14} />
                Mar 21 — Mar 28
              </button>
            </div>

            <MetricCards />

            {/* Revenue chart + Leads table */}
            <div className="grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <RevenueChart />
              </div>
              <div className="col-span-3">
                <LeadsTable
                  onAction={(lead, action) =>
                    addToast(`${lead.name}: ${action}`)
                  }
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

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
