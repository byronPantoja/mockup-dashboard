interface StatusBadgeProps {
  status: string;
  onClick?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  // Demo statuses
  New: "bg-primary-container text-[#2a3399]",
  Replied: "bg-secondary-container text-on-secondary-container",
  Meeting: "bg-tertiary-container text-[#6b3570]",
  Closed: "bg-surface-high text-on-surface/60",
  // Admin statuses
  Reviewed: "bg-tertiary-container text-[#6b3570]",
  Contacted: "bg-secondary-container text-on-secondary-container",
  Archived: "bg-surface-high text-on-surface/60",
};

const DOT_STYLES: Record<string, string> = {
  New: "bg-primary",
  Replied: "bg-on-secondary-container",
  Meeting: "bg-[#6b3570]",
  Closed: "bg-on-surface/40",
  Reviewed: "bg-[#6b3570]",
  Contacted: "bg-on-secondary-container",
  Archived: "bg-on-surface/40",
};

export default function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? "bg-surface-high text-on-surface/60";
  const dot = DOT_STYLES[status] ?? "bg-on-surface/40";
  const interactive = onClick !== undefined;

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style} ${
        interactive ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
