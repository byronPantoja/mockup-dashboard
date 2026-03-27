# BaseLine Dashboard — Design Spec

## Overview

Transform the existing BaseLine mockup dashboard into a fully functional portfolio piece with a Supabase-backed database, auth, and a public contact form for employer leads. Deployed at `mockup-dashboard.vercel.app`.

**Concept:** The public URL shows a polished, read-only dashboard populated with seed data. A "Contact Me" button lets employers submit their info, which hits a real PostgreSQL database. Byron logs in at `/login` to see real leads in an admin view.

**The "magic moment":** When an employer submits the contact form, the success message reads: *"Lead captured! This data was just sent to the PostgreSQL database and is now visible in the admin view."* — proving the app is real, not a static mockup.

## Tech Stack

- **Framework:** Next.js 16 (app router) on Vercel
- **Database + Auth:** Supabase (Postgres + Auth, free tier — 500MB, 50k MAUs)
- **Styling:** Tailwind CSS with Luminous Professional design system
- **Font:** Inter (exclusively)
- **Icons:** lucide-react (already installed)

## Data Model

### `leads` table

| Column     | Type         | Default              | Notes                                      |
|------------|--------------|----------------------|--------------------------------------------|
| id         | uuid         | gen_random_uuid()    | Primary key                                |
| name       | text         | —                    | Required                                   |
| email      | text         | —                    | Required                                   |
| company    | text         | —                    | Optional                                   |
| role       | text         | —                    | Optional                                   |
| message    | text         | —                    | Optional                                   |
| status     | text         | 'New'                | New / Reviewed / Contacted / Archived      |
| read       | boolean      | false                |                                            |
| is_seed    | boolean      | false                | true = demo data, false = real lead        |
| created_at | timestamptz  | now()                |                                            |

### Row-Level Security

- **Anonymous (anon key):** Can SELECT where `is_seed = true`. No INSERT/UPDATE/DELETE.
- **Authenticated (Byron):** Full SELECT, UPDATE, DELETE on all rows.
- **Service role (server-side only):** Used by `/api/leads` route to INSERT new leads, bypassing RLS.

**Important:** The public demo view does NOT query the database. It always uses hardcoded seed data from `seed-data.ts`. The database is only used for:
1. Contact form submissions (INSERT via API route with service role)
2. Admin view reads/updates (SELECT/UPDATE/DELETE via authenticated client)

### Auth

Single admin user created manually in Supabase dashboard. Email/password (`itsme@byronpantoja.com`). No signup flow.

## Routes

### Public (no auth)

- **`/`** — Full dashboard with seed data, read-only. Demo banner at top. "Contact Me" button in top bar.
- **`/api/leads`** — POST endpoint for contact form. Inserts into `leads` with `is_seed = false`.

### Private (behind auth)

- **`/login`** — Login form (email + password), Supabase auth.
- **`/admin`** — Dashboard showing real leads (`is_seed = false`). Status management, delete, read indicators.

## View Differences

| Element            | Public (/)                        | Admin (/admin)                       |
|--------------------|-----------------------------------|--------------------------------------|
| Data source        | Hardcoded seed data (`seed-data.ts`) | Real leads from Supabase (`is_seed = false`) |
| Demo banner        | Visible                           | Hidden                               |
| Contact Me button  | Visible (top bar)                 | Hidden                               |
| Lead status        | Read-only badges                  | Clickable dropdown to change status  |
| Lead actions       | None                              | Mark read, update status, delete     |
| Metric cards       | Calculated from seed data         | Calculated from real leads           |
| Tasks sidebar      | Static seed tasks                 | Static seed tasks                    |

## Design System: Luminous Professional

### Core Palette

| Token                       | Value     | Usage                              |
|-----------------------------|-----------|-------------------------------------|
| primary                     | #3547ed   | CTAs, active states, links          |
| primary_dim                 | #2538e1   | Gradient end for CTAs               |
| surface                     | #f9f9fb   | Page background                     |
| surface-container-low       | #f3f3f6   | Card backgrounds                    |
| surface-container-lowest    | #ffffff   | Elevated/interactive elements       |
| surface-container-high      | #e6e8ec   | Deep insets                         |
| on_surface                  | #2f3336   | Primary text (never pure black)     |
| on_primary                  | #fbf8ff   | Text on primary backgrounds         |
| secondary_container         | #daf9db   | Green pastel (status: Contacted)    |
| on_secondary_container      | #46604a   | Text on green pastel                |
| tertiary_container          | #f5d1fb   | Purple pastel (status: Reviewed)    |
| primary_container           | #b6bcff   | Blue pastel (status: New)           |
| outline_variant             | #afb2b6   | Ghost borders (15% opacity only)    |

### Key Design Rules

1. **No borders for sectioning.** Boundaries defined through background color shifts (tonal shifts). A `surface-container-low` card on a `surface` background.
2. **No pure black.** All text uses `on_surface` (#2f3336).
3. **No hard shadows.** Ambient shadows only: 40-60px blur, 4-6% opacity, tinted with `on_surface`.
4. **Glassmorphism for floating elements.** Surface colors at 80% opacity with `backdrop-blur-[20px]`. Used on sidebar and modals.
5. **Gradient CTAs.** Primary buttons use `linear-gradient(135deg, #3547ed, #2538e1)`.
6. **Ghost borders** only as accessibility fallback: `outline_variant` at 15% opacity.
7. **Labels:** ALL CAPS, `tracking-[0.05em]`, `text-[0.6875rem]` when paired with pastel icon backgrounds.
8. **Typography:** Inter exclusively. Display: 3.5rem/-0.02em. Headline: 1.75rem. Body: 0.875rem/1.6. Label: 0.6875rem.

### Component Styling

- **Sidebar:** Light glass panel (`bg-[#f3f3f6]/80 backdrop-blur-[20px]`). Active nav: `bg-[#b6bcff]/30` with `text-[#3547ed]`.
- **Status badges:** Borderless pastel pills. New: `#b6bcff`. Reviewed: `#f5d1fb`. Contacted: `#daf9db`. Archived: `#e6e8ec`.
- **Demo banner:** `bg-[#b6bcff]/20` with `text-[#3547ed]`. Subtle, blends with system.
- **Metric cards:** Tonal background, no border. Pastel icon circles (green, purple, blue, amber mapped to system).
- **Table rows:** No divider lines. Use spacing or subtle tonal alternation.
- **Dropdowns/modals:** Ambient shadow + glassmorphism backdrop.

## File Structure

```
app/
├── page.tsx                    ← Public dashboard (seed data + demo banner)
├── login/page.tsx              ← Login form
├── admin/page.tsx              ← Private dashboard (real leads)
├── api/leads/route.ts          ← POST handler for contact form
├── layout.tsx                  ← Root layout (Inter font, global styles)
└── globals.css                 ← Luminous design tokens + animations

components/
├── dashboard/
│   ├── DashboardShell.tsx      ← Sidebar + TopBar + content area wrapper
│   ├── Sidebar.tsx             ← Glass nav panel
│   ├── TopBar.tsx              ← Search, notifications, user/contact button
│   ├── MetricCards.tsx         ← 4-card grid, calculates from passed data
│   ├── RevenueChart.tsx        ← Area chart (SVG)
│   ├── LeadsTable.tsx          ← Sortable, filterable table
│   ├── TasksSidebar.tsx        ← Right panel with tasks + pipeline summary
│   └── DemoBanner.tsx          ← Top banner for public view
├── ui/
│   ├── StatusBadge.tsx         ← Pastel pill component
│   ├── ContactModal.tsx        ← Modal with form fields + success state
│   └── Toast.tsx               ← Toast notification system
└── lib/
    ├── supabase/
    │   ├── client.ts           ← Browser Supabase client
    │   └── server.ts           ← Server-side Supabase client
    ├── types.ts                ← Shared TypeScript interfaces
    └── seed-data.ts            ← Fallback seed data for when Supabase is down
```

## Interactions

### Contact Form Flow

1. User clicks "Contact Me" (primary gradient CTA in top bar)
2. Modal slides in with glassmorphism backdrop
3. Fields: Name (required), Email (required), Company, Role/Title, Message
4. Submit POSTs to `/api/leads`
5. Success state replaces form: *"Lead captured! This data was just sent to the PostgreSQL database and is now visible in the admin view."* with confetti-pop animation
6. Modal auto-dismisses after 4 seconds or on click

### Admin Lead Management

- New leads show unread indicator (dot)
- Click status badge to cycle: New > Reviewed > Contacted > Archived
- Delete with confirmation toast
- No bulk actions needed

### Error Handling

- Contact form: inline validation on required fields. Server error toast: "Something went wrong, please try me at itsme@byronpantoja.com"
- Login: inline error on bad credentials
- Supabase down: public view is unaffected (uses hardcoded `seed-data.ts`, never hits DB). Admin view and form submission would be unavailable.

## Seed Data

Two separate data sets:

**Public demo data (in `seed-data.ts`, never touches DB):**
Reuse the existing mock data from the current `page.tsx`:
- 7 business leads with names, companies, dollar values, statuses, dates
- 5 tasks
- 7-day revenue data
- Pipeline summary stats

This data looks like a generic business dashboard. It uses a different shape (has `value` field) than real employer leads.

**Database seed data (in Supabase, `is_seed = true`):**
A few sample employer-style leads inserted via SQL migration for testing the admin view. These match the `leads` table schema (name, email, company, role, message).

**Admin view table columns** differ from public view:
- Public: Name, Company, Value, Status, Date (business demo)
- Admin: Name, Email, Company/Role, Message (preview), Status, Date (real employer leads)

## Out of Scope

- Auto-email replies (Byron will email leads manually)
- Signup flow (single admin user only)
- Mobile-responsive sidebar collapse (nice-to-have if time permits)
- Real-time updates (polling on admin page load is sufficient)
