-- =========================================================
-- RESENHA FC — FORMULÁRIO DE PATROCÍNIO
-- Rode este arquivo no SQL Editor do Supabase (depois do schema.sql)
-- =========================================================

create type sponsorship_status as enum ('novo', 'em_conversa', 'fechado', 'recusado');

create table public.sponsorship_inquiries (
  id uuid primary key default uuid_generate_v4(),
  company_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  message text,
  status sponsorship_status not null default 'novo',
  created_at timestamptz not null default now()
);

alter table public.sponsorship_inquiries enable row level security;

-- Qualquer pessoa (mesmo sem login) pode enviar um pedido de patrocínio
create policy "sponsorship: qualquer pessoa pode enviar" on public.sponsorship_inquiries
  for insert with check (true);

-- Só o admin pode ver e gerenciar os pedidos recebidos
create policy "sponsorship: apenas admin lê" on public.sponsorship_inquiries
  for select using (public.is_admin());

create policy "sponsorship: apenas admin atualiza" on public.sponsorship_inquiries
  for update using (public.is_admin());

-- =========================================================
-- FIM
-- =========================================================
