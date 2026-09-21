-- Lista de e-mails que recebem o aviso de lead de franquia.
-- Editada em /painel/admin/configuracoes e lida pela function /api/lead da
-- landing (que usa service role e por isso passa direto pelo RLS).
create table if not exists public.lead_emails_mybox (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  nome text,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.lead_emails_mybox enable row level security;

-- Só admin enxerga e mexe. A checagem e feita direto em profiles_mybox para
-- nao depender de nenhuma funcao auxiliar existir no banco.
create policy "lead_emails_select_admin" on public.lead_emails_mybox
  for select using (
    exists (select 1 from public.profiles_mybox p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "lead_emails_insert_admin" on public.lead_emails_mybox
  for insert with check (
    exists (select 1 from public.profiles_mybox p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "lead_emails_update_admin" on public.lead_emails_mybox
  for update using (
    exists (select 1 from public.profiles_mybox p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "lead_emails_delete_admin" on public.lead_emails_mybox
  for delete using (
    exists (select 1 from public.profiles_mybox p where p.id = auth.uid() and p.role = 'admin')
  );

-- Comeca com os dois enderecos que ja recebiam, para nada mudar no disparo.
insert into public.lead_emails_mybox (email)
values ('pedronovaisengcp@gmail.com'), ('unidades.mybox@gmail.com')
on conflict (email) do nothing;
