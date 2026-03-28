# BaseLine — Operations Dashboard with Supabase Backend

**Live:** [mockup-dashboard.vercel.app](https://mockup-dashboard.vercel.app)

A full-stack operations dashboard built with Next.js 16, Supabase, and a custom borderless design system. It features a public-facing demo mode with hardcoded seed data and a private admin panel with real-time lead management backed by Postgres. This is the capstone project in a three-part portfolio demonstrating my ability to ship production-quality web applications.

---

## The AI-Assisted Development Process

This project was built in roughly 2 days as part of a 10-day portfolio sprint, showcasing modern AI-assisted engineering at its most effective. AI handles boilerplate and scaffolding; I focus on architecture, design system decisions, and data flow.

1. **Design System First:** Before writing code, I defined a complete "Luminous Professional" design system — borderless, tonal color surfaces with soft ambient shadows. Every component follows these tokens, producing a cohesive look without relying on any component library.
2. **Architecture Planning:** I mapped the full data flow: public page serves hardcoded seed data (never hits the database), contact form writes to Supabase Postgres, admin page reads real leads behind auth. This separation keeps the public demo fast and the admin panel functional.
3. **AI Pair Programming:** I used Claude for component scaffolding, Supabase integration patterns, and iterative design refinement. By offloading boilerplate to AI, I focused entirely on higher-order decisions: auth architecture, RLS policy design, state management patterns, and UX polish. **The result is senior-level output at an accelerated pace.**
4. **Iterative QA:** Full audit of every route, interaction state, responsive breakpoint, auth redirect, and database operation before shipping.

---

## What this project demonstrates

**For employers evaluating my work:** This is a fully functional full-stack application — not a static mockup. Real data flows through Supabase Postgres with Row Level Security, real authentication guards the admin panel, and the contact form writes to a live database.

| Skill | Where to look |
|-------|---------------|
| **Full-Stack Architecture** | Public seed data layer, Supabase Postgres backend, server-side auth checks, API routes |
| **Authentication & Authorization** | Supabase Auth with cookie-based sessions, proxy-level route protection, RLS policies |
| **Database Design** | Postgres schema with Row Level Security — anon can only read seed data, authenticated users get full access |
| **Custom Design System** | "Luminous Professional" — borderless tonal surfaces, ambient shadows, gradient accents, all via CSS custom properties |
| **Interactive Data Tables** | Sortable columns, status filtering, expandable detail rows, status cycling, inline delete |
| **Server & Client Components** | Server components for auth checks and data fetching, client components for interactive state |
| **Form Handling** | Contact modal with validation, API route for lead submission, success/error states |

---

## Pages & Features

- **`/` (Public Dashboard)** — Demo mode banner, metric cards, SVG revenue chart, sortable leads table with seed data, task sidebar, and a "Contact Me" modal that writes to Supabase.
- **`/login`** — Clean login form with Supabase email/password auth, error handling, and loading states. Redirects to `/admin` on success.
- **`/admin`** — Server-side auth check (redirects to `/login` if unauthenticated). Fetches real leads from Supabase, renders an interactive admin table with status cycling (New → Reviewed → Contacted → Archived), delete functionality, unread indicators, and expandable message rows.
- **`/api/leads`** — POST endpoint for contact form submissions with input validation.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Backend:** Supabase (Postgres + Auth + Row Level Security)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **Icons:** lucide-react
- **Font:** Inter (Google Fonts via `next/font`)
- **Auth:** Supabase SSR with cookie-based session management
- **Deployment:** Vercel
- **No component libraries** — every component built from scratch

---

## Key Components Worth Reviewing

### Auth Proxy (`proxy.ts`)
Next.js 16 renamed `middleware.ts` to `proxy.ts`. This proxy refreshes the Supabase auth token on every request, redirects unauthenticated users away from `/admin`, and redirects authenticated users away from `/login`. Cookie synchronization ensures the auth state stays consistent between client and server.

### Admin Leads Table (`components/dashboard/AdminLeadsTable.tsx`)
The most complex component in the repository — an interactive data table featuring:
- Clickable status badges that cycle through New → Reviewed → Contacted → Archived, persisting each change to Supabase.
- Blue dot unread indicators with pulse animation for new leads.
- Expandable rows revealing the lead's message and role.
- Sortable columns (name, date) and status filter buttons.
- Inline delete with optimistic UI updates and toast confirmations.

### Supabase RLS Policies (`supabase/schema.sql`)
Three policies enforce data access at the database level:
- `anon_select_seed` — anonymous users can only read seed data (`is_seed = true`).
- `anon_insert_contact` — anonymous users can submit contact forms (`is_seed = false`).
- `auth_full_access` — authenticated users have full CRUD access.

### Luminous Design System (`app/globals.css`)
A custom borderless, tonal design system defined entirely as CSS custom properties and consumed through Tailwind v4's `@theme` directive. No borders anywhere — hierarchy is created through tonal surface shifts, ambient shadows, and gradient accents.

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/byronPantoja/mockup-dashboard.git

# Navigate into the project
cd mockup-dashboard

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials to .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Required environment variables
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database setup
Run `supabase/schema.sql` in your Supabase SQL Editor to create the `leads` table, RLS policies, and seed data.

---

## Part of a Larger Portfolio

This is **Project 3 of 3** in my portfolio at [byronpantoja.com](https://byronpantoja.com):

1. **Serenity Studio** — Service business landing page with a bespoke booking UI.
2. **That's G** — Headless Shopify storefront integrated with the live Storefront API.
3. **BaseLine** (this repo) — Full-stack operations dashboard with Supabase auth, Postgres, and a custom design system.

*Each project targets a distinct domain: marketing sites, e-commerce, and internal tools.*

---

## About Me

I'm **Byron Pantoja** — a web developer based in Davao, Philippines. I turn complex technical requirements into elegant tools that non-technical people actually enjoy using.

With over 14 years of operations and brand strategy experience at Coffee For Peace, I bring seasoned business acumen to my engineering. I am now focused on building modern, high-performance web applications with Next.js, React, and Tailwind CSS.

**Available for remote work.**
📧 [byronpantoja@gmail.com](mailto:byronpantoja@gmail.com) · 🔗 [LinkedIn](https://www.linkedin.com/in/byronpantoja)
