create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  full_name text,
  avatar_url text,
  headline text,
  bio text,
  website text,
  location text,
  phone text,
  desired_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete set null,
  title text not null,
  slug text,
  summary text,
  target_role text,
  accent_color text not null default '#2563eb',
  font_family text not null default 'Manrope',
  template_name text not null default 'modern-ats',
  is_default boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resumes_user_slug_unique unique (user_id, slug)
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid not null references public.resumes (id) on delete cascade,
  school_name text not null,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  location text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid not null references public.resumes (id) on delete cascade,
  company_name text not null,
  job_title text not null,
  employment_type text,
  location text,
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  achievements jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid not null references public.resumes (id) on delete cascade,
  name text not null,
  category text,
  proficiency integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid not null references public.resumes (id) on delete cascade,
  name text not null,
  description text,
  url text,
  github_url text,
  tech_stack text[] not null default '{}'::text[],
  start_date date,
  end_date date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid references public.resumes (id) on delete cascade,
  generation_type text not null,
  prompt text not null,
  result text not null,
  provider text not null default 'mock',
  model text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  resume_id uuid references public.resumes (id) on delete cascade,
  bucket_name text not null default 'avatars',
  file_path text not null,
  file_name text not null,
  mime_type text,
  file_size bigint,
  file_kind text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_user_id on public.profiles (user_id);
create index if not exists idx_resumes_user_id on public.resumes (user_id);
create index if not exists idx_resumes_user_updated_at on public.resumes (user_id, updated_at desc);
create index if not exists idx_education_resume_id on public.education (resume_id);
create index if not exists idx_education_user_id on public.education (user_id);
create index if not exists idx_experiences_resume_id on public.experiences (resume_id);
create index if not exists idx_experiences_user_id on public.experiences (user_id);
create index if not exists idx_skills_resume_id on public.skills (resume_id);
create index if not exists idx_skills_user_id on public.skills (user_id);
create index if not exists idx_projects_resume_id on public.projects (resume_id);
create index if not exists idx_projects_user_id on public.projects (user_id);
create index if not exists idx_ai_generations_resume_id on public.ai_generations (resume_id);
create index if not exists idx_ai_generations_user_id on public.ai_generations (user_id);
create index if not exists idx_uploaded_files_user_id on public.uploaded_files (user_id);
create index if not exists idx_uploaded_files_resume_id on public.uploaded_files (resume_id);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_resumes_updated_at
before update on public.resumes
for each row execute function public.set_updated_at();

create trigger set_education_updated_at
before update on public.education
for each row execute function public.set_updated_at();

create trigger set_experiences_updated_at
before update on public.experiences
for each row execute function public.set_updated_at();

create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_ai_generations_updated_at
before update on public.ai_generations
for each row execute function public.set_updated_at();

create trigger set_uploaded_files_updated_at
before update on public.uploaded_files
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.education enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.ai_generations enable row level security;
alter table public.uploaded_files enable row level security;

create policy "Profiles are readable by owner"
on public.profiles
for select
using (auth.uid() = user_id);

create policy "Profiles are insertable by owner"
on public.profiles
for insert
with check (auth.uid() = user_id);

create policy "Profiles are updatable by owner"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Profiles are deletable by owner"
on public.profiles
for delete
using (auth.uid() = user_id);

create policy "Resumes are readable by owner"
on public.resumes
for select
using (auth.uid() = user_id);

create policy "Resumes are insertable by owner"
on public.resumes
for insert
with check (auth.uid() = user_id);

create policy "Resumes are updatable by owner"
on public.resumes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Resumes are deletable by owner"
on public.resumes
for delete
using (auth.uid() = user_id);

create policy "Education is readable by owner"
on public.education
for select
using (auth.uid() = user_id);

create policy "Education is insertable by owner"
on public.education
for insert
with check (auth.uid() = user_id);

create policy "Education is updatable by owner"
on public.education
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Education is deletable by owner"
on public.education
for delete
using (auth.uid() = user_id);

create policy "Experiences are readable by owner"
on public.experiences
for select
using (auth.uid() = user_id);

create policy "Experiences are insertable by owner"
on public.experiences
for insert
with check (auth.uid() = user_id);

create policy "Experiences are updatable by owner"
on public.experiences
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Experiences are deletable by owner"
on public.experiences
for delete
using (auth.uid() = user_id);

create policy "Skills are readable by owner"
on public.skills
for select
using (auth.uid() = user_id);

create policy "Skills are insertable by owner"
on public.skills
for insert
with check (auth.uid() = user_id);

create policy "Skills are updatable by owner"
on public.skills
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Skills are deletable by owner"
on public.skills
for delete
using (auth.uid() = user_id);

create policy "Projects are readable by owner"
on public.projects
for select
using (auth.uid() = user_id);

create policy "Projects are insertable by owner"
on public.projects
for insert
with check (auth.uid() = user_id);

create policy "Projects are updatable by owner"
on public.projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Projects are deletable by owner"
on public.projects
for delete
using (auth.uid() = user_id);

create policy "AI generations are readable by owner"
on public.ai_generations
for select
using (auth.uid() = user_id);

create policy "AI generations are insertable by owner"
on public.ai_generations
for insert
with check (auth.uid() = user_id);

create policy "AI generations are updatable by owner"
on public.ai_generations
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "AI generations are deletable by owner"
on public.ai_generations
for delete
using (auth.uid() = user_id);

create policy "Uploaded files are readable by owner"
on public.uploaded_files
for select
using (auth.uid() = user_id);

create policy "Uploaded files are insertable by owner"
on public.uploaded_files
for insert
with check (auth.uid() = user_id);

create policy "Uploaded files are updatable by owner"
on public.uploaded_files
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Uploaded files are deletable by owner"
on public.uploaded_files
for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Avatar images are publicly readable"
on storage.objects
for select
using (bucket_id = 'avatars');

create policy "Users can upload avatar images"
on storage.objects
for insert
with check (bucket_id = 'avatars' and auth.uid() = owner);

create policy "Users can update avatar images"
on storage.objects
for update
using (bucket_id = 'avatars' and auth.uid() = owner)
with check (bucket_id = 'avatars' and auth.uid() = owner);

create policy "Users can delete avatar images"
on storage.objects
for delete
using (bucket_id = 'avatars' and auth.uid() = owner);