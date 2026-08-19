-- =========================================================
-- RESENHA FC — CÓDIGO DE JOGADOR
-- Rode este arquivo no SQL Editor do Supabase (depois do schema.sql
-- e do phase3_media_albums.sql)
-- =========================================================

-- Permite cadastrar o jogador ANTES de ele ter conta (profile_id nulo),
-- com um código único que ele usa no /register para vincular a conta dele.
alter table public.players
  alter column profile_id drop not null,
  alter column jersey_number drop not null,
  alter column position drop not null;

alter table public.players drop constraint if exists players_jersey_number_active_key;

alter table public.players
  add column if not exists invite_code text unique,
  add column if not exists claimed_at timestamptz,
  add column if not exists also_admin boolean not null default false;

-- Gera um código curto e fácil de digitar/enviar por WhatsApp
create or replace function public.generate_player_code() returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- sem 0/O/1/I para evitar confusão
  result text := '';
  i int;
begin
  for i in 1..6 loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  end loop;
  return result;
end;
$$;

-- Chamada pelo próprio jogador (autenticado) logo após criar a conta.
-- Vincula o profile dele ao registro de jogador correspondente ao código
-- e já promove a role (jogador, ou admin se also_admin=true).
create or replace function public.claim_player_code(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player record;
begin
  if auth.uid() is null then
    raise exception 'Usuário não autenticado';
  end if;

  select * into v_player from public.players
    where invite_code = upper(trim(p_code)) and profile_id is null;

  if v_player is null then
    raise exception 'Código inválido ou já utilizado';
  end if;

  update public.players
    set profile_id = auth.uid(), claimed_at = now(), active = true
    where id = v_player.id;

  update public.profiles
    set role = case when v_player.also_admin then 'admin' else 'jogador' end
    where id = auth.uid();
end;
$$;

grant execute on function public.claim_player_code(text) to authenticated;

-- =========================================================
-- Pré-cadastro dos jogadores do elenco atual, cada um com um código.
-- Depois de rodar, veja os códigos gerados com o SELECT no final
-- e envie cada um para o respectivo jogador.
-- =========================================================
insert into public.players (name, also_admin, invite_code, active) values
  ('Breno', true, public.generate_player_code(), false),
  ('Clever', true, public.generate_player_code(), false),
  ('Guilherme', true, public.generate_player_code(), false),
  ('Treinador Panda', true, public.generate_player_code(), false),
  ('Adelio Vitor', false, public.generate_player_code(), false),
  ('Breno 2', false, public.generate_player_code(), false),
  ('Cadu', false, public.generate_player_code(), false),
  ('Carlos Henrique', false, public.generate_player_code(), false),
  ('Davi', false, public.generate_player_code(), false),
  ('Diogo', false, public.generate_player_code(), false),
  ('Gustavo', false, public.generate_player_code(), false),
  ('Gustavo Rexona', false, public.generate_player_code(), false),
  ('Joao Icaro', false, public.generate_player_code(), false),
  ('Marcos Saulo', false, public.generate_player_code(), false),
  ('Vini', false, public.generate_player_code(), false),
  ('Ze Marcos', false, public.generate_player_code(), false),
  ('Gustavo (2)', false, public.generate_player_code(), false),
  ('Ian', false, public.generate_player_code(), false),
  ('Oscar', false, public.generate_player_code(), false);

-- Rode este SELECT depois para ver a lista de códigos e enviar a cada jogador
select name, invite_code, also_admin as "também admin"
from public.players
where claimed_at is null
order by name;

-- =========================================================
-- FIM
-- =========================================================
