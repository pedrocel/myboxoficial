-- My Box — schema inicial

create type user_role as enum ('admin', 'owner', 'student');
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

create table public.units (
  slug text primary key,
  name text not null,
  razao_social text,
  cidade text,
  estado text,
  nome_dono text,
  telefone text,
  email text,
  whatsapp text,
  como_chegar text,
  logradouro text,
  numero text,
  cep text,
  lat double precision,
  lng double precision,
  image_background text,
  gallery_images text[] default '{}',
  is_public boolean default true,
  status boolean default true,
  visits_count integer default 0,
  owner_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  role user_role not null default 'student',
  unit_slug text references public.units(slug) on delete set null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.units
  add constraint units_owner_id_fkey
  foreign key (owner_id) references public.profiles(id) on delete set null;

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  unit_slug text not null references public.units(slug) on delete cascade,
  student_id uuid references public.profiles(id) on delete set null,
  student_name text not null,
  student_email text not null,
  student_phone text not null,
  booking_date date not null,
  booking_time time not null,
  modalidade text not null default 'Aula Experimental',
  status booking_status not null default 'pending',
  notes text,
  created_at timestamptz default now()
);

create table public.unit_visits (
  id uuid primary key default gen_random_uuid(),
  unit_slug text not null references public.units(slug) on delete cascade,
  path text,
  referrer text,
  created_at timestamptz default now()
);

-- Helpers RLS (evita recursão)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.my_role()
returns user_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.my_unit_slug()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select unit_slug from public.profiles where id = auth.uid();
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone, role, unit_slug)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student'),
    nullif(new.raw_user_meta_data->>'unit_slug', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.on_unit_visit_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.units
  set visits_count = visits_count + 1, updated_at = now()
  where slug = new.unit_slug;
  return new;
end;
$$;

create trigger unit_visits_after_insert
  after insert on public.unit_visits
  for each row execute function public.on_unit_visit_insert();

-- RLS
alter table public.profiles enable row level security;
alter table public.units enable row level security;
alter table public.bookings enable row level security;
alter table public.unit_visits enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());

create policy "units_select_public" on public.units
  for select using (true);

create policy "units_insert_admin" on public.units
  for insert with check (public.is_admin());

create policy "units_update_owner" on public.units
  for update using (
    owner_id = auth.uid()
    or public.is_admin()
    or (public.my_role() = 'owner' and slug = public.my_unit_slug())
  );

create policy "units_delete_admin" on public.units
  for delete using (public.is_admin());

create policy "bookings_insert_anon" on public.bookings
  for insert to anon, authenticated with check (true);

create policy "bookings_select_student" on public.bookings
  for select using (
    student_id = auth.uid()
    or student_email = (auth.jwt() ->> 'email')
  );

create policy "bookings_select_owner" on public.bookings
  for select using (
    public.my_role() = 'owner' and unit_slug = public.my_unit_slug()
  );

create policy "bookings_select_admin" on public.bookings
  for select using (public.is_admin());

create policy "bookings_update_staff" on public.bookings
  for update using (
    public.is_admin()
    or (public.my_role() = 'owner' and unit_slug = public.my_unit_slug())
  );

create policy "visits_insert_anon" on public.unit_visits
  for insert to anon, authenticated with check (true);

create policy "visits_select_staff" on public.unit_visits
  for select using (
    public.is_admin()
    or (public.my_role() = 'owner' and unit_slug = public.my_unit_slug())
  );

-- Permissões para API (PostgREST)
grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

grant select on table public.units to anon, authenticated;
grant insert on table public.bookings to anon, authenticated;
grant insert on table public.unit_visits to anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select, update on table public.units to authenticated;
grant select, insert, update on table public.bookings to authenticated;
grant select, insert on table public.unit_visits to authenticated;

alter default privileges in schema public grant all on tables to service_role;
