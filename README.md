# My Box Oficial

Site institucional da My Box em React, preparado para deploy na **Cloudflare Pages**.

Migração progressiva do projeto Laravel (`myboxpages-v3-main`).

## Fases da migração

| Fase | Escopo | Status |
|------|--------|--------|
| 1 | Página inicial (`home.blade.php`) | ✅ Concluída |
| 2 | Lista de unidades (`unitys.blade.php`) | ✅ Concluída |
| 3 | Detalhe da unidade (`unity-detail.blade.php`) | ✅ Concluída |
| 4 | CRM / painel admin (Supabase Auth + dashboard) | 🔜 Planejada |

## Dados das unidades (JSON estático)

As **92 unidades** vêm do `PageSeeder.php` do Laravel, convertidas para:

```
src/data/units.json
```

Para regenerar após alterar a seed:

```bash
npm run generate:units
```

**Formulários dinâmicos** (leads de franqueado, agendamentos) continuam via API — configure `VITE_API_URL` apontando para o Laravel ou Supabase Edge Functions no futuro.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- AOS (animações)
- Cloudflare Pages (SPA com `_redirects`)

## Desenvolvimento

```bash
cd myboxoficial
npm install
npm run dev
```

## Build (Cloudflare Pages)

| Configuração | Valor |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | `20` (env `NODE_VERSION`) |

O roteamento SPA (`/unidades`, etc.) é feito via `wrangler.jsonc` com `not_found_handling: single-page-application`. **Não use** `_redirects` com `/* /index.html 200` — isso causa loop infinito na Cloudflare.

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

- `VITE_API_URL` — API Laravel para agendamentos (`/api/agendamentos`, `/agendar-aula`)
- `VITE_LEADS_API_URL` — API para leads de franqueado (`/api/leads`)

## Mapeamento Laravel → React

| Laravel | React |
|---------|-------|
| `GET /` → `home.blade.php` | `/` → `HomePage` |
| `GET /unitys` → `unitys.blade.php` | `/unidades` → `UnitsListPage` |
| `GET /unidades/{page}` → `unity-detail.blade.php` | `/unidades/:slug` → `UnitDetailPage` |
| `PageSeeder.php` | `src/data/units.json` |
| `POST /api/leads` | `FranchiseForm` → `VITE_LEADS_API_URL` |
| `POST /agendar-aula` | `AgendamentoModal` → `VITE_API_URL` |
| `GET /termos`, `/privacidade` | `/termos`, `/privacidade` → fase 1b |
| Admin `/admin/*` | CRM Supabase → fase 4 |

## Modelo de dados (Supabase — fase 4+)

Baseado na tabela `pages` do Laravel — hoje servido via JSON estático.
