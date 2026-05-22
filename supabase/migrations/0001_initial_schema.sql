create extension if not exists "pgcrypto";

create type public.clinic_status as enum ('active', 'inactive');
create type public.profile_role as enum ('master', 'owner', 'professional', 'staff');
create type public.appointment_status as enum ('scheduled', 'confirmed', 'completed', 'canceled');
create type public.task_status as enum ('open', 'in_progress', 'done', 'canceled');
create type public.financial_entry_type as enum ('income', 'expense');

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.clinic_status not null default 'active',
  landing_settings jsonb not null default '{}',
  whatsapp_settings jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic_id uuid references public.clinics(id) on delete set null,
  full_name text not null,
  role public.profile_role not null default 'staff',
  created_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.procedures (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  duration_minutes integer not null default 60,
  price_cents integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.professionals (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  specialty text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  professional_id uuid references public.professionals(id) on delete set null,
  procedure_id uuid references public.procedures(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  assignee_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  due_at timestamptz,
  status public.task_status not null default 'open',
  created_at timestamptz not null default now()
);

create table public.financial_entries (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  type public.financial_entry_type not null,
  description text not null,
  amount_cents integer not null,
  due_at date,
  paid_at date,
  created_at timestamptz not null default now()
);

create table public.chat_channels (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null,
  external_provider text,
  external_id text,
  created_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  channel_id uuid not null references public.chat_channels(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.clinics enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.procedures enable row level security;
alter table public.professionals enable row level security;
alter table public.appointments enable row level security;
alter table public.tasks enable row level security;
alter table public.financial_entries enable row level security;
alter table public.chat_channels enable row level security;
alter table public.chat_messages enable row level security;

create or replace function public.current_profile_role()
returns public.profile_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_profile_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinic_id from public.profiles where id = auth.uid()
$$;

create policy "masters can manage clinics"
on public.clinics for all
using (public.current_profile_role() = 'master')
with check (public.current_profile_role() = 'master');

create policy "clinic members can read own clinic"
on public.clinics for select
using (id = public.current_profile_clinic_id());

create policy "profiles can read scoped profiles"
on public.profiles for select
using (
  public.current_profile_role() = 'master'
  or id = auth.uid()
  or clinic_id = public.current_profile_clinic_id()
);

create policy "profiles can update themselves"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "clinic scoped clients"
on public.clients for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());

create policy "clinic scoped procedures"
on public.procedures for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());

create policy "clinic scoped professionals"
on public.professionals for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());

create policy "clinic scoped appointments"
on public.appointments for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());

create policy "clinic scoped tasks"
on public.tasks for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());

create policy "clinic scoped financial entries"
on public.financial_entries for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());

create policy "clinic scoped chat channels"
on public.chat_channels for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());

create policy "clinic scoped chat messages"
on public.chat_messages for all
using (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id())
with check (public.current_profile_role() = 'master' or clinic_id = public.current_profile_clinic_id());
