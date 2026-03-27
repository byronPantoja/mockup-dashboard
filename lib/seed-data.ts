import type { DemoLead, Task } from "./types";

export const DEMO_LEADS: DemoLead[] = [
  { id: "BL-4821", name: "Sarah Chen", company: "Meridian Tech", value: 84500, status: "Qualified", date: "2026-03-27", avatar: "SC" },
  { id: "BL-4819", name: "James Wright", company: "Apex Solutions", value: 126000, status: "Negotiation", date: "2026-03-26", avatar: "JW" },
  { id: "BL-4817", name: "Maria Lopez", company: "Drift Labs", value: 52300, status: "Closed", date: "2026-03-25", avatar: "ML" },
  { id: "BL-4815", name: "Alex Kim", company: "NovaBridge", value: 97800, status: "Qualified", date: "2026-03-24", avatar: "AK" },
  { id: "BL-4812", name: "Priya Sharma", company: "Helios Inc", value: 63200, status: "Negotiation", date: "2026-03-23", avatar: "PS" },
  { id: "BL-4809", name: "David Okafor", company: "Stratos AI", value: 141000, status: "Qualified", date: "2026-03-22", avatar: "DO" },
  { id: "BL-4806", name: "Elena Petrov", company: "Waveform Co", value: 38900, status: "Closed", date: "2026-03-21", avatar: "EP" },
];

export const DEMO_TASKS: Task[] = [
  { id: "t1", title: "Review Apex SOW draft", due: "Today", completed: false },
  { id: "t2", title: "Send Meridian proposal v2", due: "Today", completed: false },
  { id: "t3", title: "Schedule NovaBridge demo", due: "Tomorrow", completed: false },
  { id: "t4", title: "Update CRM pipeline tags", due: "Mar 30", completed: false },
  { id: "t5", title: "Prep Q1 revenue deck", due: "Mar 31", completed: false },
];

export const REVENUE_DATA = [
  { day: "Mon", value: 12400 },
  { day: "Tue", value: 18200 },
  { day: "Wed", value: 15800 },
  { day: "Thu", value: 22100 },
  { day: "Fri", value: 19600 },
  { day: "Sat", value: 24800 },
  { day: "Sun", value: 28300 },
];

export const PIPELINE_STATS = [
  { label: "Qualified", count: 142, pct: 50, color: "bg-secondary-container" },
  { label: "Negotiation", count: 89, pct: 31, color: "bg-tertiary-container" },
  { label: "Closed", count: 53, pct: 19, color: "bg-surface-high" },
];

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
