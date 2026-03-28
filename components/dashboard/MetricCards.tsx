import { TrendingUp, ArrowUpRight, Users, Zap } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  sub: string;
  subPositive: boolean;
  icon: typeof TrendingUp;
  iconBg: string;
  mono?: boolean;
  sparkline?: boolean;
}

function Sparkline({ className }: { className?: string }) {
  const points = "0,28 14,22 28,25 42,15 56,18 70,10 84,4";
  return (
    <svg viewBox="0 0 84 32" fill="none" className={className}>
      <polyline
        points={points}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline points={`${points} 84,32 0,32`} fill="currentColor" opacity="0.1" />
    </svg>
  );
}

const METRICS: Metric[] = [
  {
    label: "Total Revenue",
    value: "$603,700",
    sub: "+12.4% from last month",
    subPositive: true,
    icon: TrendingUp,
    iconBg: "bg-secondary-container text-on-secondary-container",
    sparkline: true,
  },
  {
    label: "Conversion Rate",
    value: "24.8%",
    sub: "+3.2% vs last month",
    subPositive: true,
    icon: ArrowUpRight,
    iconBg: "bg-primary-container text-primary",
  },
  {
    label: "Active Leads",
    value: "284",
    sub: "47 added this week",
    subPositive: false,
    icon: Users,
    iconBg: "bg-tertiary-container text-[#6b3570]",
  },
  {
    label: "System Latency",
    value: "14ms",
    sub: "p99: 42ms",
    subPositive: false,
    icon: Zap,
    iconBg: "bg-surface-high text-on-surface/70",
    mono: true,
  },
];

export default function MetricCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {METRICS.map((m) => (
        <div
          key={m.label}
          className="rounded-2xl bg-surface-low p-5 flex flex-col gap-3 hover:bg-surface-lowest hover:shadow-ambient transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
              {m.label}
            </span>
            <div className={`size-8 rounded-xl flex items-center justify-center ${m.iconBg}`}>
              <m.icon size={16} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span
              className={`text-2xl font-bold text-on-surface tracking-tight ${
                m.mono ? "font-mono" : ""
              }`}
            >
              {m.value}
            </span>
            {m.sparkline && (
              <Sparkline className="w-20 h-8 text-on-secondary-container" />
            )}
          </div>
          <span
            className={`text-xs ${
              m.subPositive ? "text-on-secondary-container" : "text-on-surface/50"
            }`}
          >
            {m.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
