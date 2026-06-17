# Resurgent India — AI-Powered Fraud & Anti-Money-Laundering (AML/CFT) System

AML/CFT compliance platform for BFSI (Banks, NBFCs, Insurance, Payment Providers).
Marketing site + authenticated dashboard for sanction/PEP screening, risk scoring, and
compliance reporting, backed by a PostgreSQL data layer and JWT-based auth.

Built with **Next.js 16 (App Router)**, **React 18**, **TypeScript**, and **PostgreSQL**.

---

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Local development](#local-development)
- [Database setup](#database-setup)
- [Available scripts](#available-scripts)
- [Running with Docker](#running-with-docker)
- [Deployment](#deployment)
  - [Render](#deploy-to-render)
  - [AWS](#deploy-to-aws)
- [Security notes](#security-notes)

---

## Features
- Marketing site: hero, products, pricing, why-us, get-started, contact — fully responsive (320px → 4K).
- Authenticated dashboard with screening tools (AML, PEP, sanctions) and audit trail.
- JWT session auth (HttpOnly cookies) enforced by Next.js middleware on protected routes.
- PostgreSQL-backed user store with bcrypt password hashing, account activation, and demo expiry.

## Tech stack
| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 18, TypeScript, CSS Modules |
| Auth | `jose` (JWT), `bcryptjs` (password hashing) |
| Database | PostgreSQL (via `pg`) — works with Neon, AWS RDS, Supabase, etc. |
| Runtime | Node.js 20 |

> **Note on dependencies:** this is a Node.js project, so all dependencies live in
> [`package.json`](./package.json) (installed with `npm ci`). There is no `requirements.txt`
> — that is Python-only. Render and AWS install/build directly from `package.json`.

## Project structure
```
src/
  app/                  # Next.js App Router
    (marketing)/        # public pages: home, pricing, contact, login
    (dashboard)/        # authenticated dashboard + screening
    api/                # route handlers: auth (login/logout), screening, admin
  components/           # navbar, footer, UI primitives, AnimatedOrbit
  features/             # hero, products, pricing, why-us, get-started, contact …
  lib/                  # db pool, types, constants
  middleware.ts         # JWT guard for /dashboard, /aml, /sanctions, /pep, /reports
public/                 # static assets (logos, images)
Dockerfile              # multi-stage production image (standalone output)
docker-compose.yml      # local container run (reads secrets from env)
```

## Prerequisites
- **Node.js 20+** and npm
- A **PostgreSQL** database (local, or hosted: Neon / AWS RDS / Supabase)
- (Optional) **Docker** for containerized runs/deploys

## Environment variables
Copy [`.env.example`](./.env.example) to `.env.local` and fill in real values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (`postgresql://user:pass@host:5432/db?sslmode=require`) |
| `JWT_SECRET` | ✅ | Secret for signing JWTs. Use 32+ random chars. |
| `NODE_ENV` | ✅ | `development` or `production` |
| `SCREENING_UPSTREAM_URL` | ⬜ | Screening engine endpoint (use `https://`). Required for the screening feature. |
| `SCREENING_API_KEY` | ⬜ | API key for the screening engine. Set in env only — never in source. |

Generate a strong `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> **Never commit `.env.local`.** It is gitignored. In Render/AWS set these in the
> service's environment settings.

## Local development
```bash
git clone https://github.com/adraj-resurgent/AI-Powered-Fraud-Anti-Money-Laundering-System-.git
cd AI-Powered-Fraud-Anti-Money-Laundering-System-

npm ci                 # install exact dependency versions
cp .env.example .env.local   # then edit with real values
npm run dev            # http://localhost:3000
```

## Database setup
The app expects a `users` table. Minimum schema (matches the login/auth code):

```sql
CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  name         TEXT,
  email        TEXT UNIQUE NOT NULL,
  password     TEXT NOT NULL,          -- bcrypt hash
  role         TEXT DEFAULT 'user',
  account_type TEXT DEFAULT 'demo',    -- 'demo' | 'paid'
  is_active    BOOLEAN DEFAULT TRUE,
  expires_at   TIMESTAMP,              -- demo expiry (nullable)
  last_login   TIMESTAMP
);
```

Create a user with a bcrypt-hashed password (example using Node):
```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('YourPassword',10))"
# then INSERT the hash into users.password
```

## Available scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start the dev server (Turbopack) on :3000 |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint with Next.js ESLint |

## Running with Docker
The [`Dockerfile`](./Dockerfile) produces a lean multi-stage image using Next.js
standalone output. Secrets are injected at runtime, never baked in.

```bash
# Provide secrets via your shell (or a local .env file that docker-compose reads)
export DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
export JWT_SECRET="<long-random-string>"

docker compose up --build      # serves on http://localhost:3000
```

## Deployment

### Deploy to Render
1. **New → Web Service**, connect this GitHub repo.
2. Environment: **Node** (or **Docker** to use the included `Dockerfile`).
3. For the Node environment:
   - **Build command:** `npm ci && npm run build`
   - **Start command:** `npm run start`
4. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`.
5. Deploy. Render builds from `package.json` automatically.

### Deploy to AWS
Pick one path:

**A) Container (ECS Fargate / App Runner / Elastic Beanstalk):**
```bash
# Build & push the image (example: ECR)
docker build -t aml-system .
aws ecr get-login-password | docker login --username AWS --password-stdin <acct>.dkr.ecr.<region>.amazonaws.com
docker tag aml-system:latest <acct>.dkr.ecr.<region>.amazonaws.com/aml-system:latest
docker push <acct>.dkr.ecr.<region>.amazonaws.com/aml-system:latest
```
Then run it on **App Runner** or **ECS Fargate**, exposing port `3000`, with
`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production` set as environment variables.
Use **AWS RDS (PostgreSQL)** for the database.

**B) Amplify Hosting:** connect the repo, framework auto-detected as Next.js; add the
same environment variables in the Amplify console.

> Whichever platform: set the database to allow connections from the app and keep
> `sslmode=require` in `DATABASE_URL`.

## Security notes
- All secrets (`DATABASE_URL`, `JWT_SECRET`) are provided via environment variables and
  are **never** committed. `.env.local`, `docker-compose` secrets, and `backup.sql` are gitignored.
- Passwords are stored as bcrypt hashes; sessions use signed, HttpOnly JWT cookies.
- Rotate any credential that was ever shared or committed in plaintext.

---

© Resurgent India Pvt Ltd. All rights reserved.
