-- =========================================================
-- RESENHA FC — NUVEM DE MÍDIA (álbuns por jogador/treino)
-- Rode este arquivo no SQL Editor do Supabase (depois do schema.sql)
-- =========================================================

-- Permite vincular um álbum a um jogador específico
-- (ex: álbum "Fotos do Zé" na categoria "jogadores").
-- Continua funcionando normalmente para álbuns não vinculados
-- (treinos, jogos, campeonatos, eventos com nome livre).
alter table public.albums
  add column if not exists player_id uuid references public.players(id) on delete set null;

create index if not exists idx_albums_player on public.albums(player_id);

-- =========================================================
-- FIM
-- =========================================================
