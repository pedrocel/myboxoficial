# My Box Oficial

Site institucional e painel da My Box. O frontend (React) fica no **Cloudflare Pages**; o backend é a
**API da My Box** (`api/`), que roda na VPS e substituiu o Supabase.

```
myboxoficial.com.br (Cloudflare Pages)  ──fetch + cookie──▶  api.myboxoficial.com.br (VPS 200.141.24.144)
myboxfranquia.myboxoficial.com.br (landing, Pages Function) ──X-Lead-Token──▶  /leads
```

## Frontend

- React 19 + TypeScript, Vite, Tailwind CSS v4, React Router
- Visual igual a `mybox.tokadigital.com.br` (componentes em `src/styles/site.css` e `src/components/site/`)
- Unidades vêm da API; `src/data/units.json` fica de reserva se a API estiver fora do ar

```bash
npm install
npm run api:dev   # API local na porta 3020 (primeira vez: veja "API local" abaixo)
npm run dev       # site na porta 5183
```

### Build (Cloudflare Pages)

| Configuração | Valor |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |

`VITE_API_URL` de produção já está em `.env.production` (`https://api.myboxoficial.com.br`).
O roteamento SPA é feito via `wrangler.jsonc` (`not_found_handling: single-page-application`). **Não use**
`_redirects` com `/* /index.html 200`: isso causa loop infinito na Cloudflare.

## API (`api/`)

Mesmo padrão do iapi que já roda na VPS: Node 24+ executando TypeScript direto, Hono, SQLite (`node:sqlite`)
num volume Docker, senhas com scrypt e sessão em cookie HttpOnly.

| Rota | Quem usa |
|---|---|
| `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | login do painel |
| `GET /units`, `GET /units/:slug`, `PATCH /units/:slug` | site e painel (admin e dono) |
| `POST /units/:slug/visits`, `GET /units/:slug/visits` | contagem de visitas |
| `POST /bookings`, `GET /bookings`, `PATCH /bookings/:id` | agendamento (com senha opcional = conta do aluno) |
| `GET /profiles`, `GET/PATCH /profiles/...`, `POST /profiles/:id/reset-password` | usuários |
| `POST /leads`, `GET /leads/recipients` (token) / `GET`, `PATCH /leads...` (admin) | leads de franquia |
| `/lead-emails` | quem recebe o aviso de lead |
| `POST /uploads/units/:slug`, `DELETE /uploads`, `GET /files/*` | fotos da galeria |

O acesso é filtrado pela API: o admin vê tudo, o dono só a própria unidade e o aluno só os próprios agendamentos.
As senhas são aleatórias. O admin gera uma nova pelo painel (botão "Gerar nova senha" / "Criar acesso do dono").

### API local

```bash
cd api && cp .env.example .env && npm install
npm run admin -- seed-units seed/units.json
npm run admin -- create-admin voce@email.com "Seu Nome"   # mostra a senha
npm test
```

### Deploy na VPS

```bash
npm run api:deploy
```

O script roda os testes, envia `api/` para `/opt/mybox-api`, sobe o container `mybox-api` na rede `edge`
e publica `api.myboxoficial.com.br` pelo Caddy do PoseMe (`/opt/edge/sites/mybox-api.caddy`), validando antes
de recarregar. Na primeira vez cria o `.env` com um `LEAD_API_TOKEN` aleatório e carrega as 92 unidades.

Administração no servidor:

```bash
ssh root@200.141.24.144 'docker exec mybox-api node scripts/admin.ts create-admin voce@email.com "Nome"'
ssh root@200.141.24.144 'docker exec mybox-api node scripts/admin.ts create-owners'     # lista unidade;email;senha
ssh root@200.141.24.144 'docker exec mybox-api node scripts/admin.ts reset-password email@dominio.com'
```

Backup: o banco é um arquivo SQLite no volume `mybox-api_mybox-data` (`/app/data/mybox.db`).
