# Resenha FC — Site Oficial

Site completo do time de futsal Resenha FC: institucional, loja, área dos jogadores,
nuvem de mídia e painel administrativo.

Stack: **Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth, Postgres, Storage) + Vercel**

## Status do projeto

- [x] **Fase 1 — Fundação**: estrutura do projeto, schema do banco, autenticação com 3 níveis (admin/jogador/cliente), proteção de rotas
- [x] **Fase 2 — Site institucional**: home completa (banner, próximos jogos, resultados, notícias, fotos), listagem e página de notícia, galeria pública
- [x] **Fase 3 — Nuvem de mídia**: álbuns organizados por jogador, treino, jogo, campeonato e evento, upload/exclusão de fotos e vídeos pelo admin
- [ ] Loja (adiada por enquanto — o time ainda não vende camisas)
- [ ] Fase 4 — Área dos jogadores (perfil completo, mídias individuais)
- [ ] Fase 5 — Nuvem de mídia + álbuns
- [ ] Fase 6 — Painel administrativo completo

## Como rodar localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar o projeto no Supabase
1. Crie uma conta/projeto em https://supabase.com
2. No **SQL Editor**, cole e execute, nesta ordem:
   - `supabase/schema.sql` (tabelas, buckets de Storage e políticas de segurança)
   - `supabase/phase3_media_albums.sql` (permite vincular um álbum a um jogador)
3. Em **Project Settings > API**, copie a `Project URL`, a `anon public key` e a `service_role key`

### 3. Configurar variáveis de ambiente
Copie `.env.local.example` para `.env.local` e preencha com os dados do seu projeto Supabase:
```bash
cp .env.local.example .env.local
```

### 4. Criar o primeiro administrador
Depois de se cadastrar pela tela `/register` (ou pelo painel do Supabase em Authentication > Users),
rode no SQL Editor do Supabase, trocando o e-mail:
```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'seu-email@exemplo.com');
```

### 5. (Opcional) Inserir dados de teste
A home busca jogos, notícias e fotos direto do banco — sem cadastrar nada, ela aparece
vazia (com as mensagens "nenhum jogo/notícia/foto ainda"). Para ver com conteúdo, insira
algumas linhas de teste nas tabelas `games` e `news` pelo Table Editor do Supabase, ou
aguarde a Fase 6 (painel administrativo), quando isso será feito pela interface.

### 5. Rodar o projeto
```bash
npm run dev
```
Acesse http://localhost:3000

## Deploy

- **GitHub**: suba este repositório para o seu GitHub
- **Vercel**: importe o repositório na Vercel e configure as mesmas variáveis de ambiente do `.env.local`
- **Supabase**: mantenha o projeto Supabase criado no passo 2 — ele serve tanto local quanto em produção

## Estrutura de pastas

```
src/
  app/
    (auth)/login, (auth)/register   -> autenticação
    auth/callback                   -> callback do Supabase Auth
    admin/                          -> painel administrativo (protegido)
    jogador/                        -> área do jogador (protegida)
    unauthorized/                   -> página de acesso negado
  lib/
    supabase/client.ts              -> cliente Supabase (browser)
    supabase/server.ts              -> cliente Supabase (server components/actions)
    auth/roles.ts                   -> helpers de permissão por role
  middleware.ts                     -> protege /admin e /jogador por role
supabase/
  schema.sql                        -> schema completo do banco (tabelas + RLS + storage)
```

## Modelo de permissões

Três níveis de usuário (`profiles.role`):
- **admin**: acesso total (gerencia jogadores, jogos, treinos, notícias, loja, pedidos, mídia)
- **jogador**: acesso à área privada dele e conteúdo de treinos
- **cliente**: acesso à loja e aos próprios pedidos (papel padrão no cadastro público)

Contas de **admin** e **jogador** não são criadas pelo cadastro público — isso será feito
pelo painel administrativo (Fase 6), que cria o usuário no Supabase Auth e já vincula a role certa.

Jogadores desativados (que saíram do time) mantêm `players.active = false`, preservando
histórico e mídias — nada é apagado automaticamente.

## Nuvem de mídia (álbuns por jogador/treino)

Em `/admin/midia`, o admin pode criar álbuns em 5 categorias: jogadores, treinos, jogos,
campeonatos e eventos. Cada álbum vira uma "pasta" dentro do bucket `media` do Supabase
Storage, no caminho `<categoria>/<id-do-album>/arquivo`. Fotos e vídeos podem ser
enviados em lote e excluídos individualmente.

Para criar um álbum na categoria "Jogadores", é preciso existir pelo menos um jogador
na tabela `players` — o cadastro de jogadores pela interface do admin ainda não foi
construído (vem numa próxima fase). Por enquanto, insira jogadores de teste direto
pelo Table Editor do Supabase, preenchendo `profile_id` com o `id` de algum usuário
já cadastrado. Para as demais categorias não precisa de jogador — é só criar o álbum
com um nome livre (ex: "Treino 14/08") e enviar os arquivos.

## Formulário de patrocínio

Página pública em `/patrocinio` — qualquer visitante pode enviar uma proposta,
sem precisar de login. Os pedidos ficam em `/admin/patrocinios`, visível só pro
admin, com um seletor de status (Novo / Em conversa / Fechado / Recusado).

Antes de usar, rode `supabase/phase_sponsorship.sql` no SQL Editor do Supabase
(depois do `schema.sql`).

## Código de jogador (cadastro sem admin manual)

Cada jogador do elenco é pré-cadastrado com um código único de 6 caracteres, ANTES
de ter conta no site. No cadastro público (`/register`), tem um campo opcional
"Código de jogador" — quem preencher corretamente já entra vinculado ao jogador
certo, com a role certa (jogador, ou admin se o código for de admin/jogador).

Passo a passo:
1. Rode `supabase/phase_player_codes.sql` no SQL Editor (depois do `schema.sql`
   e do `phase3_media_albums.sql`) — ele já pré-cadastra o elenco atual
2. O próprio arquivo termina com um `SELECT` que lista nome + código de cada
   jogador. Rode esse SELECT (ou reabra a aba de resultados) pra copiar os códigos
3. Envie o código individual de cada jogador por WhatsApp — ele usa esse código
   na hora de criar a conta em `/register`
4. A pasta de mídia de cada jogador já foi criada automaticamente no passo 1
   (gatilho existente desde a Fase de nuvem de mídia), então o fotógrafo já pode
   subir fotos mesmo antes do jogador se cadastrar

Havia dois jogadores chamados "Gustavo" na sua lista (além do "Gustavo Rexona") —
cadastrei como "Gustavo" e "Gustavo (2)" para não colidir. Se forem a mesma pessoa,
me avise para eu corrigir.

## Privacidade das fotos

- **Treinos**: público — qualquer visitante do site vê, mesmo sem login
- **Jogadores** (fotos pessoais de cada um): privado — só usuários logados com
  role `jogador` ou `admin` conseguem ver. Um visitante comum ou cliente da loja
  não vê essas fotos, nem elas aparecem na galeria pública
- **Jogos, Campeonatos, Eventos**: público, sem mudança

Rode `supabase/phase_media_privacy.sql` no SQL Editor do Supabase para aplicar
essa regra (precisa já ter rodado o `schema.sql` antes).
