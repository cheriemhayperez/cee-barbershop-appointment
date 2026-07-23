-- Cee Barbershop schema (safe to re-run — drops existing tables, no seed data)

drop table if exists appointments cascade;
drop table if exists customers cascade;
drop table if exists services cascade;
drop table if exists barbers cascade;
drop table if exists schedule_config cascade;

create table barbers (
  id text primary key,
  name text not null,
  role text not null default 'Barber',
  exp text not null default '',
  specialty text not null default '',
  photo_index int not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table services (
  id text primary key,
  name text not null,
  price text not null,
  category text not null default 'head',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table customers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text not null,
  phone text not null default '',
  visits int not null default 0,
  last_visit date,
  created_at timestamptz not null default now()
);

create table appointments (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  email text,
  service text not null,
  barber text not null,
  date date not null,
  time text not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table schedule_config (
  id int primary key default 1 check (id = 1),
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table barbers enable row level security;
alter table services enable row level security;
alter table customers enable row level security;
alter table appointments enable row level security;
alter table schedule_config enable row level security;

create policy "barbers_select" on barbers for select using (true);
create policy "barbers_insert" on barbers for insert with check (true);
create policy "barbers_update" on barbers for update using (true);
create policy "barbers_delete" on barbers for delete using (true);

create policy "services_select" on services for select using (true);
create policy "services_insert" on services for insert with check (true);
create policy "services_update" on services for update using (true);
create policy "services_delete" on services for delete using (true);

create policy "customers_select" on customers for select using (true);
create policy "customers_insert" on customers for insert with check (true);
create policy "customers_update" on customers for update using (true);
create policy "customers_delete" on customers for delete using (true);

create policy "appointments_select" on appointments for select using (true);
create policy "appointments_insert" on appointments for insert with check (true);
create policy "appointments_update" on appointments for update using (true);
create policy "appointments_delete" on appointments for delete using (true);

create policy "schedule_select" on schedule_config for select using (true);
create policy "schedule_insert" on schedule_config for insert with check (true);
create policy "schedule_update" on schedule_config for update using (true);
