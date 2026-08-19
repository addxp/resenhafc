-- =========================================================
-- RESENHA FC — PRIVACIDADE DAS FOTOS
-- Rode este arquivo no SQL Editor do Supabase (depois dos anteriores)
--
-- Muda a regra de visibilidade:
--   - Categoria "jogadores" (fotos pessoais de cada jogador): agora só
--     visível para quem está logado como jogador ou admin.
--   - Categoria "treinos": agora pública (antes era só admin/jogador).
--   - "jogos", "campeonatos", "eventos": continuam públicas, sem mudança.
-- =========================================================

drop policy if exists "albums: leitura conforme categoria" on public.albums;

create policy "albums: leitura conforme categoria" on public.albums
  for select using (
    category <> 'jogadores' or public.is_admin() or public.current_role() = 'jogador'
  );

drop policy if exists "media: leitura conforme álbum" on public.media;

create policy "media: leitura conforme álbum" on public.media
  for select using (
    public.is_admin()
    or player_id in (select id from public.players where profile_id = auth.uid())
    or album_id is null
    or exists (
      select 1 from public.albums a
      where a.id = album_id and (a.category <> 'jogadores' or public.current_role() = 'jogador')
    )
  );

-- =========================================================
-- FIM
-- =========================================================
