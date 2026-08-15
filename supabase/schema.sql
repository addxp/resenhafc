-- =========================================================
-- RESENHA FC — SITE OFICIAL
-- Schema do banco de dados (PostgreSQL / Supabase)
-- Fase 1: Fundação — usuários, jogadores, jogos, treinos,
-- notícias, produtos, pedidos, álbuns e mídia + RLS
-- =========================================================
-- Como usar: cole este arquivo inteiro no SQL Editor do seu
-- projeto Supabase (Dashboard > SQL Editor > New query) e rode.
-- =========================================================

-- ---------------------------------------------------------
-- EXTENSÕES
-- ---------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------
create type user_role as enum ('admin', 'jogador', 'cliente');
create type player_position as enum ('goleiro', 'fixo', 'ala', 'pivo');
create type game_status as enum ('agendado', 'realizado', 'cancelado', 'adiado');
create type order_status as enum ('pendente', 'pago', 'preparando', 'enviado', 'concluido', 'cancelado');
create type payment_method as enum ('pix', 'cartao');
create type payment_status as enum ('pendente', 'aprovado', 'recusado', 'reembolsado');
create type album_category as enum ('treinos', 'jogos', 'campeonatos', 'eventos', 'jogadores');
create type media_type as enum ('foto', 'video');

-- ---------------------------------------------------------
-- PROFILES
-- Estende auth.users do Supabase com dados da aplicação.
-- Criado automaticamente via trigger quando um usuário se cadastra.
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'cliente',
  full_name text,
  phone text,
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: cria automaticamente um profile (role=cliente) quando alguém se cadastra
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------
-- PLAYERS (jogadores)
-- Um jogador está sempre ligado a um profile com role='jogador'.
-- O admin cria a conta (auth) e o registro do jogador.
-- ---------------------------------------------------------
create table public.players (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  jersey_number int not null,
  position player_position not null,
  photo_url text,
  bio text,
  active boolean not null default true, -- desativado ao sair do time (histórico preservado)
  joined_at date not null default current_date,
  left_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (jersey_number, active) -- evita 2 jogadores ativos com o mesmo número
);

-- ---------------------------------------------------------
-- NEWS (notícias)
-- ---------------------------------------------------------
create table public.news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text not null,
  cover_url text,
  published boolean not null default true,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- GAMES (jogos / partidas)
-- ---------------------------------------------------------
create table public.games (
  id uuid primary key default uuid_generate_v4(),
  opponent text not null,
  competition text,
  match_date timestamptz not null,
  location text,
  is_home boolean not null default true,
  status game_status not null default 'agendado',
  home_score int,
  away_score int,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- TRAININGS (treinos)
-- ---------------------------------------------------------
create table public.trainings (
  id uuid primary key default uuid_generate_v4(),
  training_date timestamptz not null,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- PRODUCTS (camisas / loja)
-- ---------------------------------------------------------
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  images text[] not null default '{}',
  sizes text[] not null default '{P,M,G,GG}',
  stock jsonb not null default '{}', -- ex: {"P": 5, "M": 10, "G": 8, "GG": 3}
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- ORDERS (pedidos) + ORDER_ITEMS
-- ---------------------------------------------------------
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.profiles(id),
  status order_status not null default 'pendente',
  payment_method payment_method,
  payment_status payment_status not null default 'pendente',
  -- campos prontos para integração futura com gateway de Pix/cartão
  payment_provider text,
  payment_provider_ref text,
  total numeric(10,2) not null default 0,
  shipping_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  size text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null
);

-- ---------------------------------------------------------
-- ALBUMS + MEDIA (nuvem de fotos e vídeos)
-- Os arquivos em si ficam no Supabase Storage; aqui guardamos
-- os metadados e a organização.
-- ---------------------------------------------------------
create table public.albums (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category album_category not null,
  description text,
  cover_url text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default uuid_generate_v4(),
  album_id uuid references public.albums(id) on delete set null,
  player_id uuid references public.players(id) on delete set null, -- mídia individual de um jogador
  type media_type not null,
  storage_path text not null, -- caminho no bucket do Supabase Storage
  url text not null,
  caption text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- ÍNDICES úteis
-- ---------------------------------------------------------
create index idx_players_active on public.players(active);
create index idx_games_date on public.games(match_date);
create index idx_products_active on public.products(active);
create index idx_orders_customer on public.orders(customer_id);
create index idx_media_album on public.media(album_id);
create index idx_media_player on public.media(player_id);
create index idx_news_published on public.news(published, created_at desc);

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================

-- Função auxiliar: retorna a role do usuário logado
create or replace function public.current_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer set search_path = public;

create or replace function public.is_admin()
returns boolean as $$
  select public.current_role() = 'admin';
$$ language sql stable security definer set search_path = public;

-- ---------- PROFILES ----------
alter table public.profiles enable row level security;

create policy "profiles: usuário vê o próprio perfil" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles: usuário atualiza o próprio perfil" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "profiles: admin insere/gerencia" on public.profiles
  for insert with check (public.is_admin() or auth.uid() = id);

-- ---------- PLAYERS ----------
alter table public.players enable row level security;

create policy "players: leitura pública de jogadores ativos" on public.players
  for select using (active = true or public.is_admin() or profile_id = auth.uid());

create policy "players: apenas admin gerencia" on public.players
  for insert with check (public.is_admin());
create policy "players: apenas admin atualiza" on public.players
  for update using (public.is_admin());
create policy "players: apenas admin remove" on public.players
  for delete using (public.is_admin());

-- ---------- NEWS ----------
alter table public.news enable row level security;

create policy "news: leitura pública do que está publicado" on public.news
  for select using (published = true or public.is_admin());
create policy "news: apenas admin gerencia" on public.news
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- GAMES ----------
alter table public.games enable row level security;

create policy "games: leitura pública" on public.games
  for select using (true);
create policy "games: apenas admin gerencia" on public.games
  for insert with check (public.is_admin());
create policy "games: apenas admin atualiza" on public.games
  for update using (public.is_admin());
create policy "games: apenas admin remove" on public.games
  for delete using (public.is_admin());

-- ---------- TRAININGS (visível só para admin e jogadores) ----------
alter table public.trainings enable row level security;

create policy "trainings: admin e jogadores veem" on public.trainings
  for select using (public.is_admin() or public.current_role() = 'jogador');
create policy "trainings: apenas admin gerencia" on public.trainings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- PRODUCTS ----------
alter table public.products enable row level security;

create policy "products: leitura pública do que está ativo" on public.products
  for select using (active = true or public.is_admin());
create policy "products: apenas admin gerencia" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- ORDERS / ORDER_ITEMS ----------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "orders: cliente vê os próprios pedidos" on public.orders
  for select using (customer_id = auth.uid() or public.is_admin());
create policy "orders: cliente cria pedido próprio" on public.orders
  for insert with check (customer_id = auth.uid());
create policy "orders: admin atualiza qualquer pedido" on public.orders
  for update using (public.is_admin());

create policy "order_items: visível se o pedido for do usuário ou admin" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and (o.customer_id = auth.uid() or public.is_admin()))
  );
create policy "order_items: inserido junto com pedido do próprio cliente" on public.order_items
  for insert with check (
    exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid())
  );

-- ---------- ALBUMS / MEDIA ----------
alter table public.albums enable row level security;
alter table public.media enable row level security;

-- treinos ficam visíveis só para admin/jogador; o resto é público
create policy "albums: leitura conforme categoria" on public.albums
  for select using (
    category <> 'treinos' or public.is_admin() or public.current_role() = 'jogador'
  );
create policy "albums: apenas admin gerencia" on public.albums
  for all using (public.is_admin()) with check (public.is_admin());

create policy "media: leitura conforme álbum" on public.media
  for select using (
    public.is_admin()
    or player_id in (select id from public.players where profile_id = auth.uid())
    or album_id is null
    or exists (
      select 1 from public.albums a
      where a.id = album_id and (a.category <> 'treinos' or public.current_role() = 'jogador')
    )
  );
create policy "media: apenas admin gerencia" on public.media
  for all using (public.is_admin()) with check (public.is_admin());

-- =========================================================
-- STORAGE BUCKETS
-- Rode isto também no SQL Editor (cria os buckets do Storage)
-- =========================================================
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('players', 'players', true),
  ('news', 'news', true),
  ('products', 'products', true),
  ('media', 'media', true)
on conflict (id) do nothing;

-- Leitura pública dos buckets (fotos/vídeos aparecem no site)
create policy "storage: leitura pública" on storage.objects
  for select using (bucket_id in ('avatars','players','news','products','media'));

-- Apenas admin pode enviar/gerenciar arquivos
create policy "storage: apenas admin insere" on storage.objects
  for insert with check (
    bucket_id in ('avatars','players','news','products','media') and public.is_admin()
  );
create policy "storage: apenas admin atualiza" on storage.objects
  for update using (
    bucket_id in ('avatars','players','news','products','media') and public.is_admin()
  );
create policy "storage: apenas admin remove" on storage.objects
  for delete using (
    bucket_id in ('avatars','players','news','products','media') and public.is_admin()
  );

-- =========================================================
-- FIM DO SCHEMA — FASE 1
-- Próximas fases vão adicionar: views auxiliares, funções para
-- baixa de estoque automática nos pedidos, e políticas mais finas
-- de storage por jogador (upload de mídia própria, se você quiser).
-- =========================================================
