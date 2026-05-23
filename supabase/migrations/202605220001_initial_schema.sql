create extension if not exists pgcrypto;

create schema if not exists private;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_name text,
  professional_title text,
  city text,
  country text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  personal_website_url text,
  avatar_url text,
  preferred_language text default 'en' check (preferred_language in ('en', 'es')),
  target_market text,
  target_role text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cv_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_purpose text,
  target_description text,
  template_id text default 'modern',
  output_language text default 'en' check (output_language in ('en', 'es')),
  tone text default 'professional',
  desired_length text default 'one_page',
  include_photo boolean default false,
  section_order jsonb default '["summary","education","experience","projects","achievements","skills","languages","certifications"]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.education_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  institution text,
  degree text,
  field_of_study text,
  location text,
  start_date text,
  end_date text,
  current boolean default false,
  gpa text,
  coursework text,
  honors text,
  description text,
  sort_order int default 0,
  include_in_cv boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.experience_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  role_title text,
  organization text,
  location text,
  work_mode text,
  start_date text,
  end_date text,
  current boolean default false,
  responsibilities text,
  achievements text,
  tools_used text,
  metrics text,
  team_size text,
  leadership text,
  problem_solved text,
  impact text,
  generated_bullets jsonb,
  sort_order int default 0,
  include_in_cv boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.project_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  name text,
  short_description text,
  problem_solved text,
  technologies text,
  user_role text,
  features_built text,
  results text,
  impact text,
  github_url text,
  demo_url text,
  active boolean default false,
  generated_bullets jsonb,
  sort_order int default 0,
  include_in_cv boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.achievement_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  title text,
  organization text,
  date text,
  level text,
  placement text,
  participants text,
  selection_rate text,
  prize_amount text,
  description text,
  difficulty text,
  skills_demonstrated text,
  impact text,
  proof_url text,
  generated_bullet text,
  sort_order int default 0,
  include_in_cv boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.skill_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  name text,
  category text,
  level text,
  sort_order int default 0,
  include_in_cv boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.language_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  language text,
  proficiency text,
  certification text,
  include_in_cv boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.certification_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  name text,
  issuer text,
  issue_date text,
  expiration_date text,
  credential_url text,
  description text,
  include_in_cv boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.generated_sections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null references public.cv_versions(id) on delete cascade,
  section_type text,
  content text,
  language text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists cv_versions_user_id_idx on public.cv_versions(user_id);
create index if not exists education_entries_user_cv_idx on public.education_entries(user_id, cv_id);
create index if not exists education_entries_cv_id_idx on public.education_entries(cv_id);
create index if not exists experience_entries_user_cv_idx on public.experience_entries(user_id, cv_id);
create index if not exists experience_entries_cv_id_idx on public.experience_entries(cv_id);
create index if not exists project_entries_user_cv_idx on public.project_entries(user_id, cv_id);
create index if not exists project_entries_cv_id_idx on public.project_entries(cv_id);
create index if not exists achievement_entries_user_cv_idx on public.achievement_entries(user_id, cv_id);
create index if not exists achievement_entries_cv_id_idx on public.achievement_entries(cv_id);
create index if not exists skill_entries_user_cv_idx on public.skill_entries(user_id, cv_id);
create index if not exists skill_entries_cv_id_idx on public.skill_entries(cv_id);
create index if not exists language_entries_user_cv_idx on public.language_entries(user_id, cv_id);
create index if not exists language_entries_cv_id_idx on public.language_entries(cv_id);
create index if not exists certification_entries_user_cv_idx on public.certification_entries(user_id, cv_id);
create index if not exists certification_entries_cv_id_idx on public.certification_entries(cv_id);
create index if not exists generated_sections_user_cv_idx on public.generated_sections(user_id, cv_id);
create index if not exists generated_sections_cv_id_idx on public.generated_sections(cv_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function private.set_updated_at();

drop trigger if exists set_cv_versions_updated_at on public.cv_versions;
create trigger set_cv_versions_updated_at before update on public.cv_versions
for each row execute function private.set_updated_at();

drop trigger if exists set_education_entries_updated_at on public.education_entries;
create trigger set_education_entries_updated_at before update on public.education_entries
for each row execute function private.set_updated_at();

drop trigger if exists set_experience_entries_updated_at on public.experience_entries;
create trigger set_experience_entries_updated_at before update on public.experience_entries
for each row execute function private.set_updated_at();

drop trigger if exists set_project_entries_updated_at on public.project_entries;
create trigger set_project_entries_updated_at before update on public.project_entries
for each row execute function private.set_updated_at();

drop trigger if exists set_achievement_entries_updated_at on public.achievement_entries;
create trigger set_achievement_entries_updated_at before update on public.achievement_entries
for each row execute function private.set_updated_at();

drop trigger if exists set_generated_sections_updated_at on public.generated_sections;
create trigger set_generated_sections_updated_at before update on public.generated_sections
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, preferred_language)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'en')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.cv_versions enable row level security;
alter table public.education_entries enable row level security;
alter table public.experience_entries enable row level security;
alter table public.project_entries enable row level security;
alter table public.achievement_entries enable row level security;
alter table public.skill_entries enable row level security;
alter table public.language_entries enable row level security;
alter table public.certification_entries enable row level security;
alter table public.generated_sections enable row level security;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;

create policy "Profiles are owned by users" on public.profiles
for all to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "CV versions are owned by users" on public.cv_versions
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Education entries are owned by users" on public.education_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Experience entries are owned by users" on public.experience_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Project entries are owned by users" on public.project_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Achievement entries are owned by users" on public.achievement_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Skill entries are owned by users" on public.skill_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Language entries are owned by users" on public.language_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Certification entries are owned by users" on public.certification_entries
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

create policy "Generated sections are owned by users" on public.generated_sections
for all to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-photos', 'profile-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can upload their profile photo" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can replace their profile photo" on storage.objects
for update to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can delete their profile photo" on storage.objects
for delete to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
