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
