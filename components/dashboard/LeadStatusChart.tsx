import type { Lead } from "@/lib/types";

const STATUS_COLORS: Record<Lead["status"], string> = {
  New: "bg-primary",
  Reviewed: "bg-[#c27dca]",
  Contacted: "bg-on-secondary-container",
  Archived: "bg-on-surface/30",
};

const STATUS_ORDER: Lead["status"][] = [
  "New",
  "Reviewed",
  "Contacted",
  "Archived",
];

interface LeadStatusChartProps {
  leads: Lead[];
}

export default function LeadStatusChart({ leads }: LeadStatusChartProps) {
  const total = leads.length;

  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));

  return (
    <div className="rounded-2xl bg-surface-low p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-on-surface">
            Lead Pipeline
          </h2>
          <p className="text-xs text-on-surface/50 mt-0.5">
            Status breakdown
          </p>
        </div>
        <span className="rounded-lg bg-primary-container/30 px-2 py-1 text-xs font-medium text-primary">
          {total} total
        </span>
      </div>

      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-on-surface/40">
          No leads yet
        </div>
      ) : (
        <>
          {/* Stacked bar */}
          <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-6">
            {counts.map(
              ({ status, count }) =>
                count > 0 && (
                  <div
                    key={status}
                    className={`${STATUS_COLORS[status]} rounded-full transition-all`}
                    style={{ width: `${(count / total) * 100}%` }}
                  />
                )
            )}
          </div>

          {/* Legend rows */}
          <div className="space-y-3 flex-1">
            {counts.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`size-2.5 rounded-full ${STATUS_COLORS[status]}`}
                  />
                  <span className="text-sm text-on-surface/70">{status}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-on-surface tabular-nums">
                    {count}
                  </span>
                  <span className="text-xs text-on-surface/40 font-mono w-10 text-right">
                    {total > 0 ? Math.round((count / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
