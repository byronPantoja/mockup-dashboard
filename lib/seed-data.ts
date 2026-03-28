import type { DemoLead, Task } from "./types";

export const DEMO_LEADS: DemoLead[] = [
  { id: "BP-0041", name: "Rachel Torres", company: "Canopy Health", role: "Senior Frontend Engineer", status: "Meeting", date: "2026-03-28", avatar: "RT" },
  { id: "BP-0039", name: "Mark Ellison", company: "Stratos AI", role: "Full-Stack Developer", status: "New", date: "2026-03-27", avatar: "ME" },
  { id: "BP-0037", name: "Kenji Watanabe", company: "Drift Labs", role: "React Engineer (Contract)", status: "Replied", date: "2026-03-26", avatar: "KW" },
  { id: "BP-0035", name: "Sofia Nguyen", company: "Meridian Tech", role: "Frontend Lead", status: "Closed", date: "2026-03-25", avatar: "SN" },
  { id: "BP-0033", name: "David Okafor", company: "NovaBridge", role: "Software Engineer II", status: "Meeting", date: "2026-03-24", avatar: "DO" },
  { id: "BP-0030", name: "Laura Chen", company: "Helios Inc", role: "UI Engineer", status: "Replied", date: "2026-03-23", avatar: "LC" },
  { id: "BP-0028", name: "James Adler", company: "Apex Solutions", role: "Senior Developer", status: "Closed", date: "2026-03-21", avatar: "JA" },
  { id: "BP-0024", name: "Ana Reyes", company: "Serenity Studio", role: "Website Build", status: "Closed", date: "2026-03-18", avatar: "AR", value: "50K PHP" },
  { id: "BP-0021", name: "Miguel Santos", company: "That's G", role: "Website Build", status: "Closed", date: "2026-03-14", avatar: "MS", value: "50K PHP" },
];

export const DEMO_TASKS: Task[] = [
  { id: "t1", title: "Reply to Stratos AI inquiry", due: "Today", completed: false },
  { id: "t2", title: "Prep for Canopy Health call", due: "Today", completed: false },
  { id: "t3", title: "Send Drift Labs availability", due: "Tomorrow", completed: false },
  { id: "t4", title: "Follow up with NovaBridge", due: "Mar 30", completed: false },
  { id: "t5", title: "Update portfolio case studies", due: "Mar 31", completed: false },
];

export const INBOUND_DATA = [
  { day: "Mon", value: 3 },
  { day: "Tue", value: 5 },
  { day: "Wed", value: 2 },
  { day: "Thu", value: 7 },
  { day: "Fri", value: 4 },
  { day: "Sat", value: 1 },
  { day: "Sun", value: 6 },
];

export const PIPELINE_STATS = [
  { label: "New", count: 12, pct: 34, color: "bg-primary-container" },
  { label: "Replied", count: 9, pct: 26, color: "bg-secondary-container" },
  { label: "Meeting", count: 8, pct: 23, color: "bg-tertiary-container" },
  { label: "Closed", count: 6, pct: 17, color: "bg-surface-high" },
];
