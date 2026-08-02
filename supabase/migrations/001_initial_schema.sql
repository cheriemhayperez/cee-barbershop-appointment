-- Cee Barbershop — initial database setup
-- Run in Supabase SQL Editor (Dashboard → SQL → New query).
-- WARNING: Drops all existing shop data and reseeds default services, schedule, and shop info.

drop table if exists appointments cascade;
drop table if exists customers cascade;
drop table if exists services cascade;
drop table if exists barbers cascade;
drop table if exists schedule_config cascade;
drop table if exists shop_config cascade;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table barbers (
  id text primary key,
  name text not null,
  role text not null default 'Barber',
  exp text not null default '',
  specialty text not null default '',
  photo_index int not null default 0,
  photo_url text,
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

create unique index customers_email_lower_unique
  on customers (lower(trim(email)));

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

create table shop_config (
  id int primary key default 1 check (id = 1),
  config jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table barbers enable row level security;
alter table services enable row level security;
alter table customers enable row level security;
alter table appointments enable row level security;
alter table schedule_config enable row level security;
alter table shop_config enable row level security;

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

create policy "shop_select" on shop_config for select using (true);
create policy "shop_insert" on shop_config for insert with check (true);
create policy "shop_update" on shop_config for update using (true);

-- ---------------------------------------------------------------------------
-- Storage (barber photos)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('barber-photos', 'barber-photos', true)
on conflict (id) do nothing;

drop policy if exists "barber_photos_public_read" on storage.objects;
drop policy if exists "barber_photos_insert" on storage.objects;
drop policy if exists "barber_photos_update" on storage.objects;
drop policy if exists "barber_photos_delete" on storage.objects;

create policy "barber_photos_public_read"
  on storage.objects for select
  using (bucket_id = 'barber-photos');

create policy "barber_photos_insert"
  on storage.objects for insert
  with check (bucket_id = 'barber-photos');

create policy "barber_photos_update"
  on storage.objects for update
  using (bucket_id = 'barber-photos');

create policy "barber_photos_delete"
  on storage.objects for delete
  using (bucket_id = 'barber-photos');

-- ---------------------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------------------

insert into services (id, name, price, category, status) values
  ('svc-beard-mustache-grooming', 'Beard & Mustache Grooming', '20', 'beard', 'active'),
  ('svc-beard-sculpting', 'Beard Sculpting', '15', 'beard', 'active'),
  ('svc-beard-trim', 'Beard Trim', '12', 'beard', 'active'),
  ('svc-haircut', 'Haircut', '32', 'head', 'active'),
  ('svc-head-shave', 'Head Shave', '20', 'shave', 'active'),
  ('svc-hot-towel-shave', 'Hot Towel Shave', '30', 'shave', 'active'),
  ('svc-kids-haircut', 'Kids Haircut', '30', 'head', 'active'),
  ('svc-premium-haircut', 'Premium Haircut', '45', 'head', 'active'),
  ('svc-premium-shave', 'Premium Shave', '40', 'shave', 'active'),
  ('svc-semi-permanent-color', 'Semi-Permanent Color', '23', 'color', 'active');

insert into schedule_config (id, config) values (
  1,
  '{
    "slotIntervalMinutes": 30,
    "weeklyHours": [
      { "day": 0, "label": "Sunday", "closed": false, "open": "10:00", "close": "16:00" },
      { "day": 1, "label": "Monday", "closed": false, "open": "09:00", "close": "19:00" },
      { "day": 2, "label": "Tuesday", "closed": false, "open": "09:00", "close": "19:00" },
      { "day": 3, "label": "Wednesday", "closed": false, "open": "09:00", "close": "19:00" },
      { "day": 4, "label": "Thursday", "closed": false, "open": "09:00", "close": "19:00" },
      { "day": 5, "label": "Friday", "closed": false, "open": "09:00", "close": "19:00" },
      { "day": 6, "label": "Saturday", "closed": false, "open": "08:00", "close": "18:00" }
    ],
    "disabledDates": [],
    "disabledSlots": {}
  }'::jsonb
);

insert into shop_config (id, config) values (
  1,
  '{
    "name": "Cee Barbershop",
    "address": "123 Main Street, Suite 4",
    "city": "Downtown, CA 90210",
    "footerLocation": "Downtown, CA",
    "phone": "+1 (555) 123-4567",
    "email": "hello@ceebarbershop.com",
    "mapsUrl": "https://maps.google.com/?q=123+Main+Street+Downtown+CA+90210"
  }'::jsonb
);
