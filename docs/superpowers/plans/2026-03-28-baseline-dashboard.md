# BaseLine Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing BaseLine mockup into a fully functional portfolio dashboard with Supabase backend, auth, contact form, and the Luminous Professional design system.

**Architecture:** Public page serves hardcoded seed data (never hits DB) with a contact form that writes to Supabase Postgres. Admin page behind auth shows real employer leads. Shared component library styled with the Luminous Professional borderless/tonal design system.

**Tech Stack:** Next.js 16, Supabase (Postgres + Auth), Tailwind CSS v4, Inter font, lucide-react

**Spec:** `docs/superpowers/specs/2026-03-28-baseline-dashboard-design.md`

---

## File Structure

```
app/
├── page.tsx                     ← Public dashboard (seed data + demo banner)
├── login/page.tsx               ← Login form
├── admin/
│   ├── page.tsx                 ← Server component: auth check + data fetch
│   └── AdminDashboard.tsx       ← Client component: interactive lead management
├── api/leads/route.ts           ← POST handler for contact form
├── layout.tsx                   ← Root layout (Inter font)
└── globals.css                  ← Luminous design tokens + animations

components/
├── dashboard/
│   ├── DashboardShell.tsx       ← Sidebar + TopBar + content area wrapper
│   ├── Sidebar.tsx              ← Glass nav panel
│   ├── TopBar.tsx               ← Search, user avatar, Contact Me / logout
│   ├── MetricCards.tsx          ← 4-card grid
│   ├── RevenueChart.tsx         ← SVG area chart
│   ├── LeadsTable.tsx           ← Public demo table (sortable, filterable)
│   ├── AdminLeadsTable.tsx      ← Admin table (status actions, delete)
│   ├── TasksSidebar.tsx         ← Right panel
│   └── DemoBanner.tsx           ← "Demo Mode" top banner
├── ui/
│   ├── StatusBadge.tsx          ← Pastel pill (both demo + admin variants)
│   ├── ContactModal.tsx         ← Form modal + success state
│   └── Toast.tsx                ← Toast notification system
└── lib/
    ├── supabase/
    │   ├── client.ts            ← Browser Supabase client
    │   └── server.ts            ← Server Supabase client (cookies)
    ├── types.ts                 ← TypeScript interfaces
    └── seed-data.ts             ← Hardcoded demo data

proxy.ts                         ← Auth protection for /admin routes
```

**Dependencies between tasks:**

- Task 1 (Foundation) → unblocks all other tasks
- Task 2 (Supabase setup — manual) → unblocks Tasks 9, 10, 11, 12
- Task 3 (Supabase clients) → unblocks Tasks 10, 11, 12
- Tasks 4, 5, 6, 7 (UI components) → can run in parallel after Task 1
- Task 8 (Public page) → depends on Tasks 4–7
- Task 9 (API route) → depends on Tasks 1, 2
- Tasks 9, 10, 11 (API + Login + Proxy) → can run in parallel after Tasks 2, 3
- Task 12 (Admin page) → depends on Tasks 3, 8–11
- Task 13 (Verification) → depends on all previous tasks

---

### Task 1: Project Foundation

**Files:**
- Modify: `package.json` (add deps)
- Modify: `app/globals.css` (complete rewrite)
- Modify: `app/layout.tsx` (Inter font, updated metadata)
- Create: `lib/types.ts`
- Create: `lib/seed-data.ts`
- Create: `.env.local`

- [ ] **Step 1: Install Supabase dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Create `.env.local` template**

Create `.env.local` at the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Also add `.env.local` to `.gitignore` if not already there.

- [ ] **Step 3: Rewrite `app/globals.css` with Luminous design tokens**

Replace the entire file with:

```css
@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;

  /* Primary */
  --color-primary: #3547ed;
  --color-primary-dim: #2538e1;
  --color-primary-container: #b6bcff;
  --color-on-primary: #fbf8ff;

  /* Surface hierarchy (no borders — use tonal shifts) */
  --color-surface: #f9f9fb;
  --color-surface-low: #f3f3f6;
  --color-surface-lowest: #ffffff;
  --color-surface-high: #e6e8ec;

  /* Text — never pure black */
  --color-on-surface: #2f3336;

  /* Categorical pastels */
  --color-secondary-container: #daf9db;
  --color-on-secondary-container: #46604a;
  --color-tertiary-container: #f5d1fb;

  /* Ghost border fallback */
  --color-outline-variant: #afb2b6;

  /* Ambient shadows — tinted, soft */
  --shadow-ambient: 0 4px 60px rgba(47, 51, 54, 0.05);
  --shadow-ambient-lg: 0 8px 60px rgba(47, 51, 54, 0.06);
}

/* ------------------------------------------------------------------ */
/* Animations                                                          */
/* ------------------------------------------------------------------ */

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(8px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes toast-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes toast-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(0.95) translateY(8px); }
}

@keyframes confetti-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes modal-backdrop-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
.animate-fade-in { animation: fade-in 0.2s ease-out; }
.animate-slide-in-right { animation: slide-in-right 0.2s ease-out; }
.animate-toast-in { animation: toast-in 0.2s ease-out; }
.animate-toast-out { animation: toast-out 0.2s ease-in forwards; }
.animate-confetti-pop { animation: confetti-pop 0.3s ease-out; }
.animate-modal-in { animation: modal-in 0.2s ease-out; }
.animate-modal-backdrop-in { animation: modal-backdrop-in 0.15s ease-out; }
```

- [ ] **Step 4: Update `app/layout.tsx` to use Inter font**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BaseLine — Operations Dashboard",
  description: "Business Operations & Lead Management Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-surface text-on-surface`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create `lib/types.ts`**

```typescript
// Public demo lead shape (matches current mock data)
export interface DemoLead {
  id: string;
  name: string;
  company: string;
  value: number;
  status: "Qualified" | "Negotiation" | "Closed";
  date: string;
  avatar: string;
}

// Real lead from Supabase (employer contacts)
export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string | null;
  status: "New" | "Reviewed" | "Contacted" | "Archived";
  read: boolean;
  is_seed: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  due: string;
  completed: boolean;
}

export interface ToastData {
  id: string;
  message: string;
  exiting: boolean;
}

export type DemoSortField = "value" | "date";
export type AdminSortField = "created_at" | "name";
export type SortDir = "asc" | "desc";
export type DemoStatus = DemoLead["status"] | "All";
export type AdminStatus = Lead["status"] | "All";
```

- [ ] **Step 6: Create `lib/seed-data.ts`**

Extract the mock data from the current `app/page.tsx`:

```typescript
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
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts on localhost:3000 without errors. The page may look broken (original page.tsx references removed imports) — that's fine, it gets replaced in Task 7.

- [ ] **Step 8: Commit**

```bash
git add lib/types.ts lib/seed-data.ts app/globals.css app/layout.tsx .env.local package.json package-lock.json .gitignore
git commit -m "feat: project foundation — design tokens, types, seed data, Inter font"
```

---

### Task 2: Supabase Project Setup

**Files:**
- Create: `supabase/schema.sql` (reference SQL, not executed by code)
- Modify: `.env.local` (fill in real values)

This task involves manual steps in the Supabase dashboard plus a SQL reference file.

- [ ] **Step 1: Create Supabase project**

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Name: `baseline-dashboard`
4. Database password: generate a strong one, save it
5. Region: choose closest to you
6. Wait for project to spin up (~2 minutes)

- [ ] **Step 2: Get project credentials**

1. Go to Settings → API
2. Copy "Project URL" → paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy "anon public" key → paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- [ ] **Step 3: Create the `leads` table and RLS policies**

Go to SQL Editor in Supabase dashboard and run:

```sql
-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  read BOOLEAN NOT NULL DEFAULT false,
  is_seed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anonymous can SELECT seed data only
CREATE POLICY "anon_select_seed" ON leads
  FOR SELECT
  TO anon
  USING (is_seed = true);

-- Anonymous can INSERT non-seed leads (contact form)
CREATE POLICY "anon_insert_contact" ON leads
  FOR INSERT
  TO anon
  WITH CHECK (is_seed = false);

-- Authenticated user (Byron) has full access
CREATE POLICY "auth_full_access" ON leads
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

- [ ] **Step 4: Insert seed data for admin testing**

Run in SQL Editor:

```sql
INSERT INTO leads (name, email, company, role, message, status, is_seed, created_at) VALUES
  ('Test Employer', 'test@example.com', 'Acme Corp', 'CTO', 'Interested in your portfolio work. Would love to chat about a frontend role.', 'New', true, now() - interval '2 days'),
  ('Sample Recruiter', 'recruiter@example.com', 'TechHire', 'Technical Recruiter', 'We have a React/Next.js position open. Your dashboard project caught my eye.', 'Reviewed', true, now() - interval '1 day'),
  ('Demo Contact', 'demo@example.com', 'StartupX', 'Founder', 'Looking for a frontend developer to build internal tools. Your work is impressive.', 'Contacted', true, now() - interval '3 hours');
```

- [ ] **Step 5: Create admin user**

1. Go to Authentication → Users in Supabase dashboard
2. Click "Add User" → "Create New User"
3. Email: `itsme@byronpantoja.com`
4. Password: choose a strong password
5. Check "Auto Confirm User"

- [ ] **Step 6: Save reference SQL**

Create `supabase/schema.sql`:

```sql
-- BaseLine Dashboard — Database Schema
-- Run this in Supabase SQL Editor to set up the project.

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'New',
  read BOOLEAN NOT NULL DEFAULT false,
  is_seed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_seed" ON leads
  FOR SELECT TO anon
  USING (is_seed = true);

CREATE POLICY "anon_insert_contact" ON leads
  FOR INSERT TO anon
  WITH CHECK (is_seed = false);

CREATE POLICY "auth_full_access" ON leads
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Seed data for admin view testing
INSERT INTO leads (name, email, company, role, message, status, is_seed, created_at) VALUES
  ('Test Employer', 'test@example.com', 'Acme Corp', 'CTO', 'Interested in your portfolio work. Would love to chat about a frontend role.', 'New', true, now() - interval '2 days'),
  ('Sample Recruiter', 'recruiter@example.com', 'TechHire', 'Technical Recruiter', 'We have a React/Next.js position open. Your dashboard project caught my eye.', 'Reviewed', true, now() - interval '1 day'),
  ('Demo Contact', 'demo@example.com', 'StartupX', 'Founder', 'Looking for a frontend developer to build internal tools. Your work is impressive.', 'Contacted', true, now() - interval '3 hours');
```

- [ ] **Step 7: Commit**

```bash
git add supabase/schema.sql
git commit -m "feat: add Supabase schema reference SQL"
```

---

### Task 3: Supabase Client Libraries

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`

- [ ] **Step 1: Create browser client `lib/supabase/client.ts`**

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 2: Create server client `lib/supabase/server.ts`**

Note: In Next.js 16, `cookies()` is async. This client is used in server components, route handlers, and server actions.

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll is called from Server Components where cookies
            // cannot be set. This is safe to ignore when just reading.
          }
        },
      },
    }
  );
}
```

- [ ] **Step 3: Verify imports resolve**

```bash
npm run dev
```

Expected: No module resolution errors.

- [ ] **Step 4: Commit**

```bash
git add lib/supabase/client.ts lib/supabase/server.ts
git commit -m "feat: add Supabase browser and server client setup"
```

---

### Task 4: UI Primitives (StatusBadge + Toast)

**Files:**
- Create: `components/ui/StatusBadge.tsx`
- Create: `components/ui/Toast.tsx`

- [ ] **Step 1: Create `components/ui/StatusBadge.tsx`**

Supports both demo statuses (Qualified/Negotiation/Closed) and admin statuses (New/Reviewed/Contacted/Archived). Uses borderless pastel pills per the Luminous design system.

```tsx
interface StatusBadgeProps {
  status: string;
  onClick?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  // Demo statuses
  Qualified: "bg-secondary-container text-on-secondary-container",
  Negotiation: "bg-tertiary-container text-[#6b3570]",
  Closed: "bg-surface-high text-on-surface/60",
  // Admin statuses
  New: "bg-primary-container text-[#2a3399]",
  Reviewed: "bg-tertiary-container text-[#6b3570]",
  Contacted: "bg-secondary-container text-on-secondary-container",
  Archived: "bg-surface-high text-on-surface/60",
};

const DOT_STYLES: Record<string, string> = {
  Qualified: "bg-on-secondary-container",
  Negotiation: "bg-[#6b3570]",
  Closed: "bg-on-surface/40",
  New: "bg-primary",
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
```

- [ ] **Step 2: Create `components/ui/Toast.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import type { ToastData } from "@/lib/types";

export function useToasts() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((t, i) => (i === 0 ? { ...t, exiting: true } : t));
      });
      setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 200);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const addToast = useCallback((message: string) => {
    setToasts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), message, exiting: false },
    ]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  return { toasts, addToast, dismissToast };
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 rounded-xl bg-on-surface px-4 py-3 text-sm text-surface-lowest shadow-ambient-lg ${
            t.exiting ? "animate-toast-out" : "animate-toast-in"
          }`}
        >
          <CheckCircle2 size={16} className="text-secondary-container shrink-0" />
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-2 text-surface-high hover:text-surface-lowest transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ui/StatusBadge.tsx components/ui/Toast.tsx
git commit -m "feat: add StatusBadge and Toast UI primitives"
```

---

### Task 5: Dashboard Layout Components

**Files:**
- Create: `components/dashboard/DemoBanner.tsx`
- Create: `components/dashboard/Sidebar.tsx`
- Create: `components/dashboard/TopBar.tsx`
- Create: `components/dashboard/DashboardShell.tsx`

- [ ] **Step 1: Create `components/dashboard/DemoBanner.tsx`**

```tsx
import { ExternalLink } from "lucide-react";

export default function DemoBanner() {
  return (
    <div className="shrink-0 flex items-center justify-center gap-2 bg-primary-container/20 px-4 py-2 text-xs font-medium text-primary">
      <span>Demo Mode: This dashboard is visualizing live simulated data.</span>
      <a
        href="https://github.com/byronpantoja/mockup-dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-70 transition-opacity"
      >
        View Source Code
        <ExternalLink size={12} />
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Create `components/dashboard/Sidebar.tsx`**

Glass panel design with tonal active states. No borders.

```tsx
"use client";

import {
  LayoutDashboard,
  GitBranch,
  Package,
  Settings,
  Activity,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: GitBranch, label: "Lead Pipeline" },
  { icon: Package, label: "Inventory" },
  { icon: Settings, label: "Settings" },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (label: string) => void;
}

export default function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 bg-surface-low/80 backdrop-blur-[20px] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="size-8 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
          <Activity size={16} className="text-on-primary" />
        </div>
        <span className="text-sm font-semibold text-on-surface tracking-tight">
          BaseLine
        </span>
        <span className="ml-auto rounded-lg bg-surface-high px-1.5 py-0.5 text-[10px] font-medium text-on-surface/50 font-mono">
          v2.4
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onNavChange(item.label)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-primary-container/30 text-primary font-medium"
                  : "text-on-surface/50 hover:text-on-surface hover:bg-surface-high/50"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* System Status */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.05em] text-on-surface/40">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 animate-pulse-dot" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          All Systems Operational
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create `components/dashboard/TopBar.tsx`**

Two modes: public (shows Contact Me button) and admin (shows user info + logout).

```tsx
"use client";

import { Search, Bell, ChevronDown, Plus, LogOut } from "lucide-react";

interface TopBarProps {
  mode: "public" | "admin";
  onContactClick?: () => void;
  onLogout?: () => void;
}

export default function TopBar({ mode, onContactClick, onLogout }: TopBarProps) {
  return (
    <header className="shrink-0 flex items-center gap-4 bg-surface-lowest/80 backdrop-blur-[20px] px-6 py-3">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface/30" />
        <input
          type="text"
          placeholder="Search leads, companies..."
          className="w-full rounded-xl bg-surface-low py-2 pl-9 pr-16 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-surface-high px-1.5 py-0.5 text-[10px] font-mono text-on-surface/40">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button className="relative rounded-xl p-2 text-on-surface/40 hover:text-on-surface hover:bg-surface-low transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-surface-lowest" />
        </button>

        {mode === "public" ? (
          /* Contact Me CTA */
          <button
            onClick={onContactClick}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity shadow-ambient"
          >
            <Plus size={14} />
            Contact Me
          </button>
        ) : (
          /* Admin: user + logout */
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-surface-low px-3 py-1.5">
              <div className="size-7 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-[11px] font-semibold text-on-primary">
                BP
              </div>
              <span className="text-sm font-medium text-on-surface">Byron</span>
              <ChevronDown size={14} className="text-on-surface/40" />
            </div>
            <button
              onClick={onLogout}
              className="rounded-xl p-2 text-on-surface/40 hover:text-on-surface hover:bg-surface-low transition-colors"
              title="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Create `components/dashboard/DashboardShell.tsx`**

The layout wrapper that combines Sidebar + TopBar + content area.

```tsx
"use client";

import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DemoBanner from "./DemoBanner";

interface DashboardShellProps {
  mode: "public" | "admin";
  onContactClick?: () => void;
  onLogout?: () => void;
  children: ReactNode;
}

export default function DashboardShell({
  mode,
  onContactClick,
  onLogout,
  children,
}: DashboardShellProps) {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {mode === "public" && <DemoBanner />}
        <TopBar
          mode={mode}
          onContactClick={onContactClick}
          onLogout={onLogout}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/DemoBanner.tsx components/dashboard/Sidebar.tsx components/dashboard/TopBar.tsx components/dashboard/DashboardShell.tsx
git commit -m "feat: add dashboard layout — Sidebar, TopBar, DemoBanner, DashboardShell"
```

---

### Task 6: Dashboard Content Components

**Files:**
- Create: `components/dashboard/MetricCards.tsx`
- Create: `components/dashboard/RevenueChart.tsx`
- Create: `components/dashboard/LeadsTable.tsx`
- Create: `components/dashboard/TasksSidebar.tsx`

- [ ] **Step 1: Create `components/dashboard/MetricCards.tsx`**

Tonal cards with pastel icon circles. No borders.

```tsx
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
    <div className="grid grid-cols-4 gap-4">
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
```

- [ ] **Step 2: Create `components/dashboard/RevenueChart.tsx`**

```tsx
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
```

- [ ] **Step 3: Create `components/dashboard/LeadsTable.tsx`**

Public demo table with sortable columns. Uses DemoLead data. No borders — spacing and tonal shifts.

```tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { DEMO_LEADS, formatCurrency } from "@/lib/seed-data";
import type { DemoLead, DemoSortField, DemoStatus, SortDir } from "@/lib/types";

export default function LeadsTable({
  onAction,
}: {
  onAction?: (lead: DemoLead, action: string) => void;
}) {
  const [sortField, setSortField] = useState<DemoSortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<DemoStatus>("All");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = useCallback((field: DemoSortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("desc");
      return field;
    });
  }, []);

  const filtered =
    statusFilter === "All"
      ? DEMO_LEADS
      : DEMO_LEADS.filter((l) => l.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "value") return (a.value - b.value) * mul;
    return (new Date(a.date).getTime() - new Date(b.date).getTime()) * mul;
  });

  const SortIcon = ({ field }: { field: DemoSortField }) => {
    if (sortField !== field)
      return <ChevronDown size={14} className="text-on-surface/20" />;
    return sortDir === "asc" ? (
      <ChevronUp size={14} className="text-primary" />
    ) : (
      <ChevronDown size={14} className="text-primary" />
    );
  };

  return (
    <div className="rounded-2xl bg-surface-low">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-on-surface">Recent Leads</h2>
          <p className="text-xs text-on-surface/50 mt-0.5">{filtered.length} total</p>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={14} className="text-on-surface/30" />
          {(["All", "Qualified", "Negotiation", "Closed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-primary-container/30 text-primary"
                  : "text-on-surface/50 hover:bg-surface-high"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Lead
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                ID
              </th>
              <th
                className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] cursor-pointer select-none hover:text-on-surface transition-colors"
                onClick={() => handleSort("value")}
              >
                <span className="flex items-center gap-1">
                  Value <SortIcon field="value" />
                </span>
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Status
              </th>
              <th
                className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] cursor-pointer select-none hover:text-on-surface transition-colors"
                onClick={() => handleSort("date")}
              >
                <span className="flex items-center gap-1">
                  Date <SortIcon field="date" />
                </span>
              </th>
              <th className="px-5 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((lead, i) => (
              <tr
                key={lead.id}
                className={`transition-colors hover:bg-surface-lowest/60 ${
                  i % 2 === 0 ? "" : "bg-surface-lowest/30"
                }`}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-[11px] font-semibold text-on-primary shrink-0">
                      {lead.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-on-surface">{lead.name}</p>
                      <p className="text-xs text-on-surface/50">{lead.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="font-mono text-xs text-on-surface/50">
                    {lead.id}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className="font-mono font-medium text-on-surface">
                    {formatCurrency(lead.value)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-5 py-3">
                  <span className="font-mono text-xs text-on-surface/50">
                    {lead.date}
                  </span>
                </td>
                <td
                  className="px-5 py-3 relative"
                  ref={openMenuId === lead.id ? menuRef : undefined}
                >
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === lead.id ? null : lead.id)
                    }
                    className="rounded-lg p-1 text-on-surface/30 hover:text-on-surface hover:bg-surface-high transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenuId === lead.id && (
                    <div className="absolute right-4 top-10 z-20 w-44 rounded-xl bg-surface-lowest/90 backdrop-blur-[20px] py-1 shadow-ambient-lg animate-fade-in">
                      {["Mark as Qualified", "Move to Negotiation", "Close Lead"].map(
                        (action) => (
                          <button
                            key={action}
                            onClick={() => {
                              setOpenMenuId(null);
                              onAction?.(lead, action);
                            }}
                            className="flex w-full items-center px-3 py-2 text-sm text-on-surface hover:bg-surface-low transition-colors"
                          >
                            {action}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `components/dashboard/TasksSidebar.tsx`**

```tsx
"use client";

import { useState, useCallback } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { DEMO_TASKS, PIPELINE_STATS } from "@/lib/seed-data";
import type { Task } from "@/lib/types";

export default function TasksSidebar({
  onTaskComplete,
}: {
  onTaskComplete?: (title: string) => void;
}) {
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const next = { ...t, completed: !t.completed };
          if (next.completed) onTaskComplete?.(t.title);
          return next;
        })
      );
    },
    [onTaskComplete]
  );

  return (
    <aside className="w-72 shrink-0 bg-surface-lowest p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-on-surface">Upcoming Tasks</h2>
        <span className="rounded-lg bg-primary-container/30 px-2 py-0.5 text-xs font-medium text-primary">
          {tasks.filter((t) => !t.completed).length}
        </span>
      </div>

      <div className="space-y-1">
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-low ${
              task.completed ? "opacity-50" : ""
            } ${task.completed ? "animate-confetti-pop" : ""}`}
          >
            {task.completed ? (
              <CheckCircle2 size={18} className="mt-0.5 text-primary shrink-0" />
            ) : (
              <Circle
                size={18}
                className="mt-0.5 text-on-surface/20 group-hover:text-on-surface/40 shrink-0 transition-colors"
              />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm text-on-surface ${
                  task.completed ? "line-through text-on-surface/40" : ""
                }`}
              >
                {task.title}
              </p>
              <p className="text-xs text-on-surface/40 font-mono mt-0.5">
                {task.due}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Pipeline Summary */}
      <div className="pt-4 mt-4">
        <h3 className="text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-3">
          Pipeline Summary
        </h3>
        <div className="space-y-2.5">
          {PIPELINE_STATS.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-on-surface/70">{s.label}</span>
                <span className="font-mono text-on-surface/50">{s.count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-high overflow-hidden">
                <div
                  className={`h-full rounded-full ${s.color} transition-all`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/MetricCards.tsx components/dashboard/RevenueChart.tsx components/dashboard/LeadsTable.tsx components/dashboard/TasksSidebar.tsx
git commit -m "feat: add dashboard content — MetricCards, RevenueChart, LeadsTable, TasksSidebar"
```

---

### Task 7: Contact Modal

**Files:**
- Create: `components/ui/ContactModal.tsx`

- [ ] **Step 1: Create `components/ui/ContactModal.tsx`**

Glassmorphism modal with form fields and success state.

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

type ModalState = "form" | "submitting" | "success";

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [state, setState] = useState<ModalState>("form");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setState("submitting");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      role: (form.elements.namedItem("role") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setState("success");
      setTimeout(() => {
        onClose();
        setState("form");
      }, 4000);
    } catch {
      setState("form");
      setError(
        "Something went wrong. Please try me at itsme@byronpantoja.com"
      );
    }
  }

  function handleClose() {
    onClose();
    setState("form");
    setError(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-backdrop-in"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl bg-surface-lowest/90 backdrop-blur-[20px] p-6 shadow-ambient-lg animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-xl p-1.5 text-on-surface/40 hover:text-on-surface hover:bg-surface-low transition-colors"
        >
          <X size={18} />
        </button>

        {state === "success" ? (
          /* Success state */
          <div className="text-center py-8 animate-fade-in">
            <div className="size-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4 animate-confetti-pop">
              <CheckCircle2 size={32} className="text-on-secondary-container" />
            </div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              Lead captured!
            </h3>
            <p className="text-sm text-on-surface/60 leading-relaxed max-w-xs mx-auto">
              This data was just sent to the PostgreSQL database and is now
              visible in the admin view.
            </p>
          </div>
        ) : (
          /* Form state */
          <>
            <h3 className="text-lg font-semibold text-on-surface mb-1">
              Get in touch
            </h3>
            <p className="text-sm text-on-surface/50 mb-6">
              I&apos;d love to hear about your project or opportunity.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Name *
                  </label>
                  <input
                    name="name"
                    required
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Company
                  </label>
                  <input
                    name="company"
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                    Role / Title
                  </label>
                  <input
                    name="role"
                    className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all"
                    placeholder="Your role"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={3}
                  className="w-full rounded-xl bg-surface-low px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:bg-surface-lowest focus:shadow-ambient transition-all resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 animate-fade-in">{error}</p>
              )}

              <button
                type="submit"
                disabled={state === "submitting"}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-4 py-2.5 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity shadow-ambient disabled:opacity-50"
              >
                {state === "submitting" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/ContactModal.tsx
git commit -m "feat: add ContactModal with form, validation, and success state"
```

---

### Task 8: Public Page

**Files:**
- Modify: `app/page.tsx` (complete rewrite)

- [ ] **Step 1: Rewrite `app/page.tsx`**

Wire all components together with seed data. This replaces the entire 663-line monolith.

```tsx
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
```

- [ ] **Step 2: Verify the public page renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected:
- Luminous design system applied (light glass sidebar, no borders, tonal cards)
- Demo banner at top with "Demo Mode" text
- "Contact Me" button in top bar
- Metric cards, revenue chart, leads table, tasks sidebar all render
- Contact modal opens on "Contact Me" click (form submission will fail until API route exists — that's OK)

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire public dashboard page with all components"
```

---

### Task 9: API Route for Lead Submission

**Files:**
- Create: `app/api/leads/route.ts`

- [ ] **Step 1: Create `app/api/leads/route.ts`**

POST handler that inserts a lead into Supabase using the anon key (RLS allows anonymous insert for non-seed leads).

```typescript
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, company, role, message } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.from("leads").insert({
      name,
      email,
      company: company || null,
      role: role || null,
      message: message || null,
      is_seed: false,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
```

- [ ] **Step 2: Test the API endpoint**

With the dev server running, use curl:

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","company":"TestCo","role":"Dev","message":"Hello"}'
```

Expected: `{"success":true}` with status 201.

Verify in Supabase dashboard → Table Editor → leads: new row appears with `is_seed = false`.

- [ ] **Step 3: Test the full contact form flow**

1. Open `http://localhost:3000`
2. Click "Contact Me"
3. Fill in form and submit
4. Expected: Success state shows "Lead captured!" message
5. Verify in Supabase: new row in leads table

- [ ] **Step 4: Commit**

```bash
git add app/api/leads/route.ts
git commit -m "feat: add POST /api/leads route for contact form submissions"
```

---

### Task 10: Login Page

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Create `app/login/page.tsx`**

Simple login form using Supabase auth. Luminous design system styling.

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Activity, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
            <Activity size={20} className="text-on-primary" />
          </div>
          <span className="text-lg font-semibold text-on-surface tracking-tight">
            BaseLine
          </span>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-surface-low p-6">
          <h1 className="text-lg font-semibold text-on-surface mb-1">
            Admin Login
          </h1>
          <p className="text-sm text-on-surface/50 mb-6">
            Sign in to view real leads and manage your pipeline.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl bg-surface-lowest px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:shadow-ambient transition-all"
                placeholder="itsme@byronpantoja.com"
              />
            </div>

            <div>
              <label className="block text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-xl bg-surface-lowest px-3 py-2 text-sm text-on-surface placeholder:text-on-surface/30 outline-none focus:shadow-ambient transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 animate-fade-in">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dim px-4 py-2.5 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity shadow-ambient disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Back to demo */}
        <p className="text-center text-sm text-on-surface/40 mt-6">
          <a href="/" className="hover:text-primary transition-colors">
            ← Back to demo dashboard
          </a>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify login page renders**

Open `http://localhost:3000/login`. Expected: Clean login form with BaseLine branding, Luminous styling.

- [ ] **Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat: add login page with Supabase auth"
```

---

### Task 11: Auth Proxy (Route Protection)

**Files:**
- Create: `proxy.ts` (project root)

**Important:** Next.js 16 renamed `middleware.ts` to `proxy.ts`. The export is `proxy` not `middleware`.

- [ ] **Step 1: Create `proxy.ts`**

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth token on every request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect /admin routes — redirect to /login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If logged in and visiting /login, redirect to /admin
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Test route protection**

1. Visit `http://localhost:3000/admin` without logging in
2. Expected: Redirected to `/login`
3. Log in with your Supabase credentials
4. Expected: Redirected to `/admin`
5. Visit `/login` while logged in
6. Expected: Redirected to `/admin`

- [ ] **Step 3: Commit**

```bash
git add proxy.ts
git commit -m "feat: add auth proxy for /admin route protection"
```

---

### Task 12: Admin Dashboard

**Files:**
- Create: `app/admin/page.tsx` (server component: auth + data fetch)
- Create: `app/admin/AdminDashboard.tsx` (client component: interactive UI)
- Create: `components/dashboard/AdminLeadsTable.tsx`

- [ ] **Step 1: Create `components/dashboard/AdminLeadsTable.tsx`**

Interactive table for real leads. Status cycling, delete, read indicator.

```tsx
"use client";

import { useState, useCallback } from "react";
import { Trash2, Circle } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Lead, AdminSortField, AdminStatus, SortDir } from "@/lib/types";

const STATUS_CYCLE: Lead["status"][] = ["New", "Reviewed", "Contacted", "Archived"];

interface AdminLeadsTableProps {
  leads: Lead[];
  onStatusChange: (id: string, status: Lead["status"]) => void;
  onDelete: (id: string) => void;
}

export default function AdminLeadsTable({
  leads,
  onStatusChange,
  onDelete,
}: AdminLeadsTableProps) {
  const [sortField, setSortField] = useState<AdminSortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<AdminStatus>("All");

  const handleSort = useCallback((field: AdminSortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        return prev;
      }
      setSortDir("desc");
      return field;
    });
  }, []);

  const filtered =
    statusFilter === "All"
      ? leads
      : leads.filter((l) => l.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortField === "name") return a.name.localeCompare(b.name) * mul;
    return (
      (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) *
      mul
    );
  });

  function cycleStatus(lead: Lead) {
    const idx = STATUS_CYCLE.indexOf(lead.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onStatusChange(lead.id, next);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="rounded-2xl bg-surface-low">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-on-surface">Leads</h2>
          <p className="text-xs text-on-surface/50 mt-0.5">
            {filtered.length} total
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {(["All", "New", "Reviewed", "Contacted", "Archived"] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-primary-container/30 text-primary"
                    : "text-on-surface/50 hover:bg-surface-high"
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="px-5 py-3 w-4" />
              <th
                className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] cursor-pointer select-none hover:text-on-surface transition-colors"
                onClick={() => handleSort("name")}
              >
                Name
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Email
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Company / Role
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Message
              </th>
              <th className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em]">
                Status
              </th>
              <th
                className="px-5 py-3 text-[0.6875rem] font-medium text-on-surface/50 uppercase tracking-[0.05em] cursor-pointer select-none hover:text-on-surface transition-colors"
                onClick={() => handleSort("created_at")}
              >
                Date
              </th>
              <th className="px-5 py-3 w-12" />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-sm text-on-surface/40"
                >
                  No leads yet. They&apos;ll appear here when someone submits
                  the contact form.
                </td>
              </tr>
            )}
            {sorted.map((lead, i) => (
              <tr
                key={lead.id}
                className={`transition-colors hover:bg-surface-lowest/60 ${
                  i % 2 === 0 ? "" : "bg-surface-lowest/30"
                }`}
              >
                {/* Unread indicator */}
                <td className="px-2 py-3 text-center">
                  {!lead.read && (
                    <Circle
                      size={8}
                      fill="#3547ed"
                      className="text-primary inline-block"
                    />
                  )}
                </td>
                <td className="px-5 py-3 font-medium text-on-surface">
                  {lead.name}
                </td>
                <td className="px-5 py-3">
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                </td>
                <td className="px-5 py-3 text-on-surface/70">
                  {[lead.company, lead.role].filter(Boolean).join(" · ") ||
                    "—"}
                </td>
                <td className="px-5 py-3 max-w-[200px]">
                  <p className="text-on-surface/60 truncate">
                    {lead.message || "—"}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge
                    status={lead.status}
                    onClick={() => cycleStatus(lead)}
                  />
                </td>
                <td className="px-5 py-3">
                  <span className="font-mono text-xs text-on-surface/50">
                    {formatDate(lead.created_at)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => onDelete(lead.id)}
                    className="rounded-lg p-1 text-on-surface/20 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/admin/AdminDashboard.tsx`**

Client component with interactive lead management. Calls server-side mutations via fetch.

```tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import MetricCards from "@/components/dashboard/MetricCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AdminLeadsTable from "@/components/dashboard/AdminLeadsTable";
import TasksSidebar from "@/components/dashboard/TasksSidebar";
import { ToastContainer, useToasts } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types";
import { Calendar } from "lucide-react";

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
    async (id: string, status: Lead["status"]) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("leads")
        .update({ status, read: true })
        .eq("id", id);

      if (error) {
        addToast("Failed to update status");
        return;
      }

      setLeads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status, read: true } : l))
      );
      addToast(`Lead updated to ${status}`);
    },
    [addToast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("leads").delete().eq("id", id);

      if (error) {
        addToast("Failed to delete lead");
        return;
      }

      setLeads((prev) => prev.filter((l) => l.id !== id));
      addToast("Lead deleted");
    },
    [addToast]
  );

  return (
    <>
      <DashboardShell mode="admin" onLogout={handleLogout}>
        <div className="flex">
          <div className="flex-1 p-6 space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-on-surface tracking-tight">
                  Admin — Live Leads
                </h1>
                <p className="text-sm text-on-surface/50 mt-0.5">
                  Real contacts from your portfolio dashboard
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

          <TasksSidebar
            onTaskComplete={(title) => addToast(`"${title}" completed`)}
          />
        </div>
      </DashboardShell>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
```

- [ ] **Step 3: Create `app/admin/page.tsx`**

Server component that checks auth and fetches leads from Supabase.

```tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("is_seed", false)
    .order("created_at", { ascending: false });

  return <AdminDashboard initialLeads={leads ?? []} />;
}
```

- [ ] **Step 4: Test the full admin flow**

1. Visit `http://localhost:3000/admin` → should redirect to `/login`
2. Log in with Supabase credentials → should redirect to `/admin`
3. Admin dashboard renders with "Admin — Live Leads" heading
4. If you submitted test leads via the contact form, they appear in the table
5. Click a status badge → cycles through New/Reviewed/Contacted/Archived
6. Click the trash icon → deletes the lead with a toast confirmation
7. Logout button returns to public dashboard

- [ ] **Step 5: Commit**

```bash
git add components/dashboard/AdminLeadsTable.tsx app/admin/AdminDashboard.tsx app/admin/page.tsx
git commit -m "feat: add admin dashboard with live lead management"
```

---

### Task 13: End-to-End Verification & Deploy

**Files:**
- Possibly modify: any files with issues found during verification

- [ ] **Step 1: Verify build succeeds**

```bash
npm run build
```

Expected: Build completes with no errors. Fix any TypeScript or build errors.

- [ ] **Step 2: Test the public dashboard**

1. `npm run dev`
2. Visit `http://localhost:3000`
3. Verify: Demo banner visible, all cards/chart/table render, Luminous design system applied
4. Click "Contact Me" → form modal opens
5. Submit with test data → success state appears
6. Check Supabase: new lead row exists

- [ ] **Step 3: Test the admin flow**

1. Visit `/admin` → redirects to `/login`
2. Log in → redirects to `/admin`
3. New lead from step 2 appears in admin table
4. Click status badge → status changes
5. Click delete → lead removed
6. Logout → returns to public page

- [ ] **Step 4: Verify on Vercel**

Ensure `.env.local` values are set in Vercel:
1. Go to Vercel dashboard → mockup-dashboard project → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Push to trigger deploy

```bash
git push origin main
```

4. Visit `mockup-dashboard.vercel.app` — verify everything works in production

- [ ] **Step 5: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: address issues found during e2e verification"
git push origin main
```
