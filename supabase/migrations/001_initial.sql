-- wise-invite initial schema

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  invite_count int default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  org_id uuid references organizations(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id) on delete cascade,
  title text not null,
  event_date date not null,
  event_time time not null,
  location text,
  description text,
  template_id text default 'classic',
  pdf_url text,
  share_code text unique default substr(md5(random()::text), 1, 8),
  status text default 'draft' check (status in ('draft', 'published', 'expired')),
  ai_generated_desc text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists invite_analytics (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references invites(id) on delete cascade,
  event_type text check (event_type in ('view', 'google_calendar_click', 'apple_calendar_click', 'share')),
  ip_hash text,
  user_agent text,
  created_at timestamptz default now()
);

-- updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger invites_updated_at
  before update on invites
  for each row execute function update_updated_at();

-- RLS
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table invites enable row level security;
alter table invite_analytics enable row level security;

-- profiles: user sees own profile
create policy "profiles_select_own" on profiles
  for select using (user_id = auth.uid());

create policy "profiles_insert_own" on profiles
  for insert with check (user_id = auth.uid());

-- organizations: user sees own org
create policy "organizations_select_own" on organizations
  for select using (
    id in (select org_id from profiles where user_id = auth.uid())
  );

create policy "organizations_update_own" on organizations
  for update using (
    id in (select org_id from profiles where user_id = auth.uid())
  );

-- invites: user sees own org invites
create policy "invites_select_own" on invites
  for select using (
    org_id in (select org_id from profiles where user_id = auth.uid())
  );

create policy "invites_insert_own" on invites
  for insert with check (
    org_id in (select org_id from profiles where user_id = auth.uid())
  );

create policy "invites_update_own" on invites
  for update using (
    org_id in (select org_id from profiles where user_id = auth.uid())
  );

create policy "invites_delete_own" on invites
  for delete using (
    org_id in (select org_id from profiles where user_id = auth.uid())
  );

-- invites: public can see published invites (for /invite/[code] page)
create policy "invites_select_published" on invites
  for select using (status = 'published');

-- analytics: insert is public (track guest clicks, no auth required)
create policy "analytics_insert_public" on invite_analytics
  for insert with check (true);

-- analytics: owner can read own invite analytics
create policy "analytics_select_own" on invite_analytics
  for select using (
    invite_id in (
      select id from invites where org_id in (
        select org_id from profiles where user_id = auth.uid()
      )
    )
  );

-- Storage bucket for PDFs (run via Supabase dashboard or CLI)
-- insert into storage.buckets (id, name, public) values ('invites-pdf', 'invites-pdf', true);
