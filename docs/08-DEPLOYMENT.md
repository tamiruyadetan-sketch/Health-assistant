# Deployment

## 1. Overview

| Component | Platform | Notes |
|---|---|---|
| Frontend (`apps/web`) | Vercel | Auto-deploy on push to `main`; preview deploys per PR |
| Backend (`apps/api`) | Render or Railway | Auto-deploy on push to `main`; run Prisma migrations on deploy |
| Database | Neon or Supabase (managed Postgres) | Separate branches/projects for staging vs production |
| CI | GitHub Actions | Lint, typecheck, test, build on every PR |
| Error monitoring | Sentry (frontend + backend) | Optional but recommended before public launch |

## 2. Environment Variables

`.env.example` (checked into git, no real values):

```
# Backend
DATABASE_URL=postgresql://user:password@host:5432/dbname
ANTHROPIC_API_KEY=sk-ant-xxxx
JWT_SECRET=change-me
CORS_ORIGIN=https://yourdomain.com
NODE_ENV=production

# Frontend (Vite, must be prefixed VITE_)
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

Set real values in each platform's dashboard (Vercel → Project →
Settings → Environment Variables; Render/Railway → Environment).
Never commit a real `.env`.

## 3. Database Migrations

- `npx prisma migrate dev` locally while developing.
- `npx prisma migrate deploy` as part of the backend's production
  deploy step (run automatically via a Render/Railway "build/release"
  command, or a GitHub Actions job that runs before the deploy).
- `npx prisma db seed` once, after the first production migration, to
  load initial disease content.

## 4. GitHub Actions — CI (example)

`.github/workflows/ci.yml`:
```yaml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test --if-present
      - run: npm run build
```

Deployment itself is typically handled by Vercel's/Render's/Railway's
own GitHub integration (auto-deploy on push to `main`) rather than a
custom Actions deploy step — simpler and keeps secrets on their side.

## 5. Domains & SSL

- Point your domain's DNS (A/CNAME per platform instructions) to Vercel
  for the frontend (`yourdomain.com`) and to Render/Railway for the API
  (`api.yourdomain.com`).
- SSL certificates are auto-provisioned by both platforms — no manual
  cert management needed.

## 6. Rollback Plan

- Vercel and Render/Railway both keep prior deploys — one-click
  "redeploy previous version" if a release breaks something.
- For DB migrations, write them additively where possible (avoid
  destructive column drops in the same release as the feature that
  needs them) so a frontend/backend rollback doesn't strand the schema.

## 7. Pre-Launch Checklist

- [ ] All 12+ categories and their diseases seeded in both languages.
- [ ] AI disclaimer visible in both languages, on page and in chat widget.
- [ ] Rate limiting active on `/api/ai/chat`.
- [ ] CORS locked to production frontend origin.
- [ ] Lighthouse mobile score ≥ 90.
- [ ] `/health` endpoint returns 200 and is wired to an uptime monitor.
- [ ] Error monitoring (Sentry or similar) receiving events from both
      frontend and backend.
- [ ] Database backups confirmed enabled on the managed Postgres provider.
