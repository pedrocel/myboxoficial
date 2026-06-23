-- Customização de unidades + storage galeria

alter table public.units
  add column if not exists horarios jsonb default '[
    {"dia":"Segunda — Sexta","musc":"06h — 23h","cross":"06h, 07h, 08h, 12h, 18h, 19h, 20h"},
    {"dia":"Sábado","musc":"08h — 18h","cross":"09h, 10h, 11h"},
    {"dia":"Domingo","musc":"09h — 15h","cross":"10h, 11h"}
  ]'::jsonb,
  add column if not exists modalidades jsonb default '[
    {"id":"musc","icon":"fa-dumbbell","title":"Musculação","desc":"Equipamentos de última geração.","color":"from-emerald-500/20 to-emerald-600/5","enabled":true},
    {"id":"cross","icon":"fa-running","title":"Cross Training","desc":"Metodologia My Box.","color":"from-green-500/20 to-green-600/5","enabled":true},
    {"id":"coletiva","icon":"fa-users","title":"Aulas Coletivas","desc":"Comunidade e energia.","color":"from-lime-500/20 to-lime-600/5","enabled":true},
    {"id":"coffee","icon":"fa-coffee","title":"My Coffee","desc":"Café especial no conceito shopping fitness.","color":"from-amber-500/20 to-amber-600/5","enabled":true}
  ]'::jsonb,
  add column if not exists hero_image text,
  add column if not exists description text;

-- Bucket galeria (público leitura)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'unit-gallery',
  'unit-gallery',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "gallery_public_read" on storage.objects
  for select using (bucket_id = 'unit-gallery');

create policy "gallery_owner_upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'unit-gallery'
    and (
      public.is_admin()
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'owner'
          and (storage.foldername(name))[1] = p.unit_slug
      )
    )
  );

create policy "gallery_owner_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'unit-gallery'
    and (
      public.is_admin()
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'owner'
          and (storage.foldername(name))[1] = p.unit_slug
      )
    )
  );
