-- ═══════════════════════════════════════════════════════════
-- CONNEC8 v5 — Supabase Schema
-- Run this in Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════

-- ── PROJECTS ────────────────────────────────────────────────
create table if not exists projects (
  id                bigserial primary key,
  title             text        not null,
  category          text        not null default 'Website',
  display_type      text        not null default 'website', -- 'website' | 'app'
  featured          boolean     not null default false,
  impact_metric     text,
  year              text,
  sort_order        integer     not null default 99,
  thumbnail_url     text,
  preview_video_url text,
  live_url          text,
  tags              text[]      default '{}',
  technologies      text[]      default '{}',
  description       text,
  problem           text,
  solution          text,
  result            text,
  created_at        timestamptz not null default now()
);

alter table projects enable row level security;

-- Public can SELECT
create policy "projects_public_read"
  on projects for select to anon, authenticated using (true);

-- Authenticated can do everything
create policy "projects_auth_all"
  on projects for all to authenticated using (true) with check (true);

-- ── TESTIMONIALS ─────────────────────────────────────────────
create table if not exists testimonials (
  id          bigserial primary key,
  name        text        not null,
  role        text        not null,
  company     text,
  metric      text,
  text        text        not null,
  avatar      text,
  sort_order  integer     not null default 99,
  created_at  timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "testi_public_read"
  on testimonials for select to anon, authenticated using (true);

create policy "testi_auth_all"
  on testimonials for all to authenticated using (true) with check (true);

-- ── LEADS ────────────────────────────────────────────────────
create table if not exists leads (
  id          bigserial primary key,
  name        text,
  business    text,
  service     text,
  message     text,
  created_at  timestamptz not null default now()
);

alter table leads enable row level security;

-- Anyone can insert
create policy "leads_public_insert"
  on leads for insert to anon, authenticated with check (true);

-- Only authenticated can read/delete
create policy "leads_auth_read"
  on leads for select to authenticated using (true);

create policy "leads_auth_delete"
  on leads for delete to authenticated using (true);

-- ── STORAGE BUCKETS ──────────────────────────────────────────
-- Create these in Supabase → Storage → New bucket (set Public: true)
--   thumbnails
--   project-videos
--   screenshots

-- Then run these policies in SQL Editor:
insert into storage.buckets (id, name, public) values
  ('thumbnails',     'thumbnails',     true),
  ('project-videos', 'project-videos', true),
  ('screenshots',    'screenshots',    true)
on conflict (id) do nothing;

-- Allow authenticated uploads to all media buckets
create policy "media_auth_upload"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('thumbnails','project-videos','screenshots'));

create policy "media_public_read"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('thumbnails','project-videos','screenshots'));

create policy "media_auth_delete"
  on storage.objects for delete to authenticated
  using (bucket_id in ('thumbnails','project-videos','screenshots'));

-- ── SEED DATA ────────────────────────────────────────────────
insert into projects (title, category, display_type, featured, impact_metric, year, sort_order, tags, technologies, description, problem, solution, result)
values
  ('NovaPay Billing Platform', 'Billing System', 'website', true,  '8+ hrs/week saved', '2024', 1, array['Invoicing','Automation'], array['JavaScript','Node.js'], 'Complete billing platform.', 'Manual invoicing via WhatsApp.',   'Custom billing system.', 'Zero missed payments.'),
  ('LogiCore Operations Hub',  'Admin Panel',    'website', true,  '40% faster ops',    '2024', 2, array['Dashboard','Analytics'],  array['HTML','Firebase'],      'Operations dashboard.',    'Six spreadsheets, no truth.',      'Role-based admin panel.',  '40% faster operations.'),
  ('Meridian Brand Website',   'Website',        'website', true,  '3× more enquiries', '2023', 3, array['Brand','SEO'],            array['HTML','CSS','GSAP'],    'Full brand website.',       'Zero online presence.',             'Premium SEO website.',     '3× more enquiries.');

insert into testimonials (name, role, company, metric, text, avatar, sort_order)
values
  ('Rahul Mehta',    'Founder',            'NovaPay',  '8 hrs saved weekly',   'Connec8 replaced our entire manual billing process. What used to take three hours now runs automatically.',    'RM', 1),
  ('Sneha Kulkarni', 'Operations Manager', 'LogiCore', '40% ops improvement',  'We were drowning in spreadsheets. Connec8 built us a dashboard that gave our entire team visibility.',         'SK', 2),
  ('Arjun Pillai',   'Managing Director',  'Meridian', '3× more leads',        'The website they delivered is exactly what we needed — premium, fast, and professional.',                       'AP', 3),
  ('Priya Sharma',   'CEO',                'FlowDesk', '20 hrs/week automated','The automation system saved us roughly 20 hours per week. Like having an extra team member who never sleeps.',  'PS', 4);
