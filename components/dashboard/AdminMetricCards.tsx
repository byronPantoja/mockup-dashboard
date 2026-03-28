import { Users, Building2, Briefcase, MessageSquare } from "lucide-react";
import type { Lead } from "@/lib/types";

interface AdminMetricCardsProps {
  leads: Lead[];
}

export default function AdminMetricCards({ leads }: AdminMetricCardsProps) {
  const totalLeads = leads.length;
  const unread = leads.filter((l) => !l.read).length;
  const companies = new Set(leads.map((l) => l.company).filter(Boolean)).size;
  const roles = new Set(leads.map((l) => l.role).filter(Boolean)).size;
  const withMessage = leads.filter((l) => l.message).length;

  const metrics = [
    {
      label: "Total Leads",
      value: String(totalLeads),
      sub: unread > 0 ? `${unread} unread` : "All read",
      subHighlight: unread > 0,
      icon: Users,
      iconBg: "bg-primary-container text-primary",
    },
    {
      label: "Companies",
      value: String(companies),
      sub: `from ${totalLeads} submissions`,
      subHighlight: false,
      icon: Building2,
      iconBg: "bg-secondary-container text-on-secondary-container",
    },
    {
      label: "Roles",
      value: String(roles),
      sub: "unique positions",
      subHighlight: false,
      icon: Briefcase,
      iconBg: "bg-tertiary-container text-[#6b3570]",
    },
    {
      label: "Messages",
      value: String(withMessage),
      sub:
        totalLeads > 0
          ? `${Math.round((withMessage / totalLeads) * 100)}% included a note`
          : "No leads yet",
      subHighlight: false,
      icon: MessageSquare,
      iconBg: "bg-surface-high text-on-surface/70",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-2xl bg-surface-low p-5 flex flex-col gap-3 hover:bg-surface-lowest hover:shadow-ambient transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
              {m.label}
            </span>
            <div
              className={`size-8 rounded-xl flex items-center justify-center ${m.iconBg}`}
            >
              <m.icon size={16} />
            </div>
          </div>
          <span className="text-2xl font-bold text-on-surface tracking-tight">
            {m.value}
          </span>
          <span
            className={`text-xs ${
              m.subHighlight
                ? "text-primary font-medium"
                : "text-on-surface/50"
            }`}
          >
            {m.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
