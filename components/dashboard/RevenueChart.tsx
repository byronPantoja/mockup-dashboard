import { REVENUE_DATA } from "@/lib/seed-data";

function AreaChart({ data }: { data: typeof REVENUE_DATA }) {
  const max = Math.max(...data.map((d) => d.value));
  const h = 160;
  const w = 100;
  const padY = 8;
  const usableH = h - padY * 2;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = padY + usableH - (d.value / max) * usableH;
    return `${x},${y}`;
  });

  const linePath = points.join(" ");
  const areaPath = `${points.join(" ")} ${w},${h} 0,${h}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full h-44"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3547ed" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#3547ed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPath} fill="url(#areaGrad)" />
      <polyline
        points={linePath}
        fill="none"
        stroke="#3547ed"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = padY + usableH - (d.value / max) * usableH;
        return (
          <circle
            key={d.day}
            cx={x}
            cy={y}
            r="2"
            fill="white"
            stroke="#3547ed"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

export default function RevenueChart() {
  return (
    <div className="rounded-2xl bg-surface-low p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-on-surface">Revenue Pulse</h2>
          <p className="text-xs text-on-surface/50 mt-0.5">7-day growth trend</p>
        </div>
        <span className="rounded-lg bg-secondary-container px-2 py-1 text-xs font-medium text-on-secondary-container">
          +18.3%
        </span>
      </div>
      <AreaChart data={REVENUE_DATA} />
      <div className="flex justify-between mt-2 px-1">
        {REVENUE_DATA.map((d) => (
          <span
            key={d.day}
            className="text-[10px] font-mono text-on-surface/40"
          >
            {d.day}
          </span>
        ))}
      </div>
    </div>
  );
}
