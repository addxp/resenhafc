# Resenha FC — Site Oficial

Site completo do time de futsal Resenha FC: institucional, loja, área dos jogadores,
nuvem de mídia e painel administrativo.

Stack: **Next.js (App Router) + TypeScript + Tailwind + Supabase (Auth, Postgres, Storage) + Vercel**

## Status do projeto

- [x] **Fase 1 — Fundação**: estrutura do projeto, schema do banco, autenticação com 3 níveis (admin/jogador/cliente), proteção de rotas
- [x] **Fase 2 — Site institucional**: home completa (banner, próximos jogos, resultados, notícias, fotos), listagem e página de notícia, galeria pública
- [ ] Fase 3 — Loja (catálogo, carrinho, checkout, estoque)
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
2. No **SQL Editor**, cole e execute o conteúdo de `supabase/schema.sql`
   (cria todas as tabelas, os buckets de Storage e as políticas de segurança)
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
