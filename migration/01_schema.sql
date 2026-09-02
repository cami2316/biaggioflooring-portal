-- ============================================================
-- Biaggio Flooring LLC — Supabase schema
-- Run in SQL Editor: paste this entire file and click Run
-- ============================================================

create extension if not exists pgcrypto;

-- --------------------------------------------------------
-- companies
-- --------------------------------------------------------
create table if not exists public.companies (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists companies_name_lower_uidx
  on public.companies (lower(name));

-- --------------------------------------------------------
-- customers
-- --------------------------------------------------------
create table if not exists public.customers (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email         text,
  phone         text,
  address       text,
  city_state    text,
  created_at    timestamptz not null default now()
);

create unique index if not exists customers_name_lower_uidx
  on public.customers (lower(customer_name));

-- --------------------------------------------------------
-- projects
-- --------------------------------------------------------
create table if not exists public.projects (
  id           uuid primary key default gen_random_uuid(),
  project_code text,
  project_name text not null,
  customer_id  uuid references public.customers(id) on delete set null,
  address      text,
  status       text not null default 'active',
  created_at   timestamptz not null default now()
);

create unique index if not exists projects_project_code_uidx
  on public.projects (project_code)
  where project_code is not null;

-- --------------------------------------------------------
-- invoices
-- --------------------------------------------------------
create table if not exists public.invoices (
  id                uuid primary key default gen_random_uuid(),
  invoice_number    text,
  company_id        uuid references public.companies(id) on delete restrict,
  project_id        uuid references public.projects(id) on delete set null,
  customer_id       uuid references public.customers(id) on delete set null,
  representative    text,
  issue_date        date not null default current_date,
  due_date          date,
  terms             text,
  status            text not null default 'pending',
  subtotal          numeric(12,2) not null default 0,
  discount          numeric(12,2) not null default 0,
  total             numeric(12,2) not null default 0,
  total_paid        numeric(12,2) not null default 0,
  notes             text,
  source            text,
  source_sheet_id   text,
  source_sheet_name text,
  created_at        timestamptz not null default now()
);

create unique index if not exists invoices_source_sheet_id_uidx
  on public.invoices (source_sheet_id)
  where source_sheet_id is not null;

create index if not exists invoices_project_id_idx  on public.invoices (project_id);
create index if not exists invoices_customer_id_idx on public.invoices (customer_id);

-- --------------------------------------------------------
-- invoice_sections
-- --------------------------------------------------------
create table if not exists public.invoice_sections (
  id         uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  title      text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists invoice_sections_invoice_id_idx
  on public.invoice_sections (invoice_id, sort_order);

-- --------------------------------------------------------
-- invoice_items
-- --------------------------------------------------------
create table if not exists public.invoice_items (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  section_id  uuid references public.invoice_sections(id) on delete set null,
  description text not null,
  quantity    numeric(12,2) not null default 0,
  unit        text not null default 'unit',
  unit_price  numeric(12,2) not null default 0,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists invoice_items_invoice_id_idx
  on public.invoice_items (invoice_id, sort_order);

-- --------------------------------------------------------
-- payments
-- --------------------------------------------------------
create table if not exists public.payments (
  id          uuid primary key default gen_random_uuid(),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  amount      numeric(12,2) not null,
  method      text not null default 'other',
  received_at timestamptz not null default now(),
  notes       text,
  created_at  timestamptz not null default now()
);

create index if not exists payments_invoice_id_idx
  on public.payments (invoice_id, received_at);

-- --------------------------------------------------------
-- calendar_events
-- --------------------------------------------------------
create table if not exists public.calendar_events (
  id              uuid primary key default gen_random_uuid(),
  company_id      uuid references public.companies(id) on delete cascade,
  customer_id     uuid references public.customers(id) on delete set null,
  project_id      uuid references public.projects(id) on delete set null,
  title           text not null,
  type            text not null default 'site_visit'
                    check (type in ('site_visit', 'installation', 'follow_up', 'other')),
  start_at        timestamptz not null,
  end_at          timestamptz,
  notes           text,
  google_event_id text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists calendar_events_start_at_idx on public.calendar_events (start_at);
create index if not exists calendar_events_company_idx  on public.calendar_events (company_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_calendar_events_updated_at on public.calendar_events;
create trigger set_calendar_events_updated_at
  before update on public.calendar_events
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------
-- Seed: company
-- --------------------------------------------------------
insert into public.companies (name)
select 'Biaggio Flooring LLC'
where not exists (
  select 1 from public.companies where lower(name) = lower('Biaggio Flooring LLC')
);
);