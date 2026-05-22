create extension if not exists "pgcrypto";

do $$
begin
  create type public.app_role as enum ('master', 'admin_clinica', 'secretaria', 'profissional');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.tenant_status as enum ('trial', 'ativa', 'bloqueada', 'cancelada');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  responsible_name text not null,
  email text not null,
  phone text,
  document text,
  address text,
  city text,
  state text,
  logo_url text,
  primary_color text not null default '#0f766e',
  secondary_color text not null default '#f59e0b',
  status public.tenant_status not null default 'trial',
  trial_starts_at date,
  trial_ends_at date,
  monthly_price_cents integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role public.app_role not null default 'admin_clinica',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  logo_url text,
  primary_color text not null default '#0f766e',
  secondary_color text not null default '#f59e0b',
  whatsapp_settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  status public.tenant_status not null default 'trial',
  monthly_price_cents integer not null default 0,
  trial_starts_at date,
  trial_ends_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.procedures add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.professionals add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.appointments add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.tasks add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.financial_entries add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.chat_channels add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;
alter table public.chat_messages add column if not exists tenant_id uuid references public.tenants(id) on delete cascade;

alter table public.tenants enable row level security;
alter table public.user_profiles enable row level security;
alter table public.tenant_settings enable row level security;
alter table public.subscriptions enable row level security;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select
    case
      when lower(coalesce(auth.jwt() ->> 'email', '')) = 'matheus@almeidamkt.com.br' then 'master'::public.app_role
      else (select role from public.user_profiles where id = auth.uid())
    end
$$;

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id from public.user_profiles where id = auth.uid()
$$;

create or replace function public.is_master()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'master'::public.app_role
$$;

drop policy if exists "master manages tenants" on public.tenants;
create policy "master manages tenants"
on public.tenants for all
using (public.is_master())
with check (public.is_master());

drop policy if exists "tenant users read own tenant" on public.tenants;
create policy "tenant users read own tenant"
on public.tenants for select
using (id = public.current_tenant_id());

drop policy if exists "master manages user profiles" on public.user_profiles;
create policy "master manages user profiles"
on public.user_profiles for all
using (public.is_master())
with check (public.is_master());

drop policy if exists "users read own tenant profiles" on public.user_profiles;
create policy "users read own tenant profiles"
on public.user_profiles for select
using (id = auth.uid() or tenant_id = public.current_tenant_id());

drop policy if exists "master manages tenant settings" on public.tenant_settings;
create policy "master manages tenant settings"
on public.tenant_settings for all
using (public.is_master())
with check (public.is_master());

drop policy if exists "tenant users read own settings" on public.tenant_settings;
create policy "tenant users read own settings"
on public.tenant_settings for select
using (tenant_id = public.current_tenant_id());

drop policy if exists "master manages subscriptions" on public.subscriptions;
create policy "master manages subscriptions"
on public.subscriptions for all
using (public.is_master())
with check (public.is_master());

drop policy if exists "tenant users read own subscription" on public.subscriptions;
create policy "tenant users read own subscription"
on public.subscriptions for select
using (tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped clients v2" on public.clients;
create policy "tenant scoped clients v2"
on public.clients for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped procedures v2" on public.procedures;
create policy "tenant scoped procedures v2"
on public.procedures for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped professionals v2" on public.professionals;
create policy "tenant scoped professionals v2"
on public.professionals for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped appointments v2" on public.appointments;
create policy "tenant scoped appointments v2"
on public.appointments for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped tasks v2" on public.tasks;
create policy "tenant scoped tasks v2"
on public.tasks for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped financial entries v2" on public.financial_entries;
create policy "tenant scoped financial entries v2"
on public.financial_entries for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped chat channels v2" on public.chat_channels;
create policy "tenant scoped chat channels v2"
on public.chat_channels for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

drop policy if exists "tenant scoped chat messages v2" on public.chat_messages;
create policy "tenant scoped chat messages v2"
on public.chat_messages for all
using (public.is_master() or tenant_id = public.current_tenant_id())
with check (public.is_master() or tenant_id = public.current_tenant_id());

insert into public.user_profiles (id, tenant_id, full_name, email, role)
select id, null, coalesce(raw_user_meta_data ->> 'full_name', email), email, 'master'
from auth.users
where lower(email) = 'matheus@almeidamkt.com.br'
on conflict (id) do update set
  tenant_id = null,
  email = excluded.email,
  role = 'master',
  updated_at = now();
