create table if not exists public.landing_leads (
  id uuid primary key default gen_random_uuid(),
  clinic_name text not null,
  responsible_name text not null,
  email text not null,
  phone text not null,
  city text,
  state text,
  message text,
  status text not null default 'novo',
  created_at timestamptz not null default now()
);

alter table public.landing_leads enable row level security;

drop policy if exists "public can create landing leads" on public.landing_leads;
create policy "public can create landing leads"
on public.landing_leads for insert
with check (true);

drop policy if exists "master can read landing leads" on public.landing_leads;
create policy "master can read landing leads"
on public.landing_leads for select
using (public.is_master());

drop policy if exists "master can update landing leads" on public.landing_leads;
create policy "master can update landing leads"
on public.landing_leads for update
using (public.is_master())
with check (public.is_master());
