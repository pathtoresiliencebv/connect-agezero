# Agezero Connect

> Your dashboard for AI-powered integrations. Log in, connect your apps,
> drive them from any agent.

Agezero Connect is a Next.js app that gives you a Maton-style dashboard —
sidebar nav, integrations grid, connections table, tasks panel — with
**per-user authentication** so every tenant only sees their own data.

It's modeled after the patterns from the [Maton API Gateway skill](https://github.com/maton-ai/api-gateway-skill)
and the [Maton agent toolkit](https://github.com/maton-ai/agent-toolkit),
but the gateway itself is backed by [Nango](https://nango.dev) so you
own the deployment.

## Features

- 🔐 **Email + password auth** via NextAuth (JWT sessions).
- 🗂️ **Sidebar dashboard** — Platform (Home / Connections / Tasks / Usage)
  + Resources (API Gateway / Trust Center).
- 🔌 **Integrations grid** with 24 popular apps (Gmail, Slack, Notion,
  HubSpot, Stripe, GitHub, OpenAI, …) and live Connect flow via Nango.
- 📋 **Connections table** — App, Account, Connection ID, Method, Status,
  Created; filters + pagination.
- 🧠 **Tasks panel** — left sidebar with Today / Older task list, main
  chat-style composer with model + permission + skills pickers, plus
  suggested actions.
- 🪪 **Per-user API keys** — generate, copy (shown once), list.
- 🚀 **Vercel-ready** — push to git, import on Vercel, set env vars,
  deploy.

## Quick start

```bash
# 1. Install
npm install

# 2. Generate a NextAuth secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local

# 3. Set up the seed user
node scripts/hash-password.js demo
# → copy the bcrypt hash that prints
cat >> .env.local <<EOF
SEED_USER_EMAIL=demo@agezero.app
SEED_USER_NAME=Demo User
SEED_USER_PASSWORD_HASH=<paste-hash-here>
EOF

# 4. (Optional) enable live Nango integration
#    Sign up at https://app.nango.dev, then add:
#    NEXT_PUBLIC_NANGO_PUBLIC_KEY=...
#    NANGO_SECRET_KEY=...
#    NEXT_PUBLIC_NANGO_DEFAULT_CONNECTION_ID=demo-user

# 5. Run
npm run dev
# open http://localhost:3000 → sign in with demo@agezero.app / demo
```

## Environment variables

| Name                                  | Required | Where used                                    |
| ------------------------------------- | -------- | --------------------------------------------- |
| `NEXTAUTH_SECRET`                     | yes      | JWT signing for sessions                      |
| `NEXTAUTH_URL`                        | yes      | Base URL (use https://… in prod)              |
| `SEED_USER_EMAIL`                     | yes      | Demo email                                    |
| `SEED_USER_NAME`                      | yes      | Demo display name                             |
| `SEED_USER_PASSWORD_HASH`             | yes      | bcrypt hash of the demo password              |
| `NEXT_PUBLIC_NANGO_PUBLIC_KEY`        | optional | Client-side Nango Connect UI                  |
| `NANGO_SECRET_KEY`                    | optional | Server-side Nango proxy + connections list    |
| `NANGO_API_BASE`                      | optional | Override Nango API base URL                   |
| `NEXT_PUBLIC_NANGO_DEFAULT_CONNECTION_ID` | optional | Default connection id used in flows       |

Without the Nango vars, the connections table and Connect flow surface
a friendly "configure Nango" message instead of crashing.

## Project structure

```
app/
├── layout.tsx                    # root: SessionProvider, dark theme
├── globals.css
├── (auth)/
│   └── login/page.tsx            # /login
├── (app)/                        # protected group — auth-gated layout
│   ├── layout.tsx                # redirects to /login if no session
│   ├── page.tsx                  # /  → Home (API key + integrations grid)
│   ├── connections/page.tsx      # /connections
│   ├── tasks/page.tsx            # /tasks
│   ├── usage/page.tsx            # /usage
│   ├── api-gateway/page.tsx      # /api-gateway
│   └── trust-center/page.tsx     # /trust-center
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── keys/route.ts             # GET / POST / DELETE — per-user API keys
    ├── nango/proxy/route.ts      # POST — Nango proxy (auth required)
    ├── nango/connections/route.ts# GET  — connections (auth required)
    └── tasks/route.ts            # GET / POST — task store

components/
├── Providers.tsx                 # NextAuth SessionProvider
├── Sidebar.tsx + Topbar.tsx + AppShell.tsx
├── AppCard.tsx + AppIcon.tsx
├── ApiKeyCard.tsx
├── ConnectionsTable.tsx
├── TasksPanel.tsx + TaskChat.tsx
└── LoginForm.tsx

lib/
├── auth.ts                       # NextAuth config
├── users.ts                      # file-backed user store
├── tasks-store.ts                # file-backed task store (seeded)
├── catalog.ts                    # 24 supported apps
├── nango-server.ts
└── nango-client.ts
```

## Deploy to Vercel

```bash
# 1. Commit + push
git init && git add . && git commit -m "feat: agezero connect"
git branch -M main
git remote add origin git@github.com:YOU/agezero-connect.git
git push -u origin main

# 2. Import on Vercel
#    https://vercel.com/new → pick the repo → Framework: Next.js
#
# 3. Set environment variables in Project Settings → Environment Variables:
#    NEXTAUTH_SECRET, NEXTAUTH_URL, SEED_USER_EMAIL, SEED_USER_NAME,
#    SEED_USER_PASSWORD_HASH, NEXT_PUBLIC_NANGO_PUBLIC_KEY, NANGO_SECRET_KEY
#
# 4. Deploy. Done.
```

The Nango proxy route is Node-runtime, so Vercel will spin it up as a
real Next.js server — no static export required.

## License

MIT.

---

## Deployment notes

### Auth on Vercel serverless

Vercel's serverless functions run with a **read-only filesystem**, so the
file-backed user store (`data/users.json`) can't be written to. The auth
flow is set up to fall back to an **env-only seed user** so the demo
account keeps working on every cold start:

- `SEED_USER_EMAIL` and `SEED_USER_PASSWORD_PLAIN` are read at request time
  and the password is compared directly (no bcrypt — it's the plaintext).
- Any other users that need to sign in **must** be added via a real
  database (see "Swapping the store" below). The fallback only covers the
  env-configured seed account.

### Swapping the store (recommended for production)

The data layer is split into small files in `lib/`:

| File                  | Replace with                                  |
| --------------------- | --------------------------------------------- |
| `lib/users.ts`        | Postgres / Vercel KV / Supabase user table    |
| `lib/tasks-store.ts`  | Postgres / Vercel KV task table               |
| `app/api/keys/route.ts` (write path) | Vercel KV / Postgres key store    |

Vercel KV is the smallest swap: `npm i @vercel/kv`, then in each file
replace the `fs.readFileSync` / `fs.writeFileSync` calls with `kv.get`
/ `kv.set`. The public function signatures stay the same so no UI
changes are needed.
