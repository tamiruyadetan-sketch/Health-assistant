<<<<<<< HEAD
# Disease Info & AI Health Assistant Platform

A bilingual (English / Afaan Oromoo) web platform for browsing disease categories,
reading structured medical information (overview, symptoms, food recommendations),
and chatting with an AI assistant about a specific disease. Works on mobile and desktop.

## Repo Structure (suggested)

```
health-portal/
├── README.md
├── docs/
│   ├── 01-PRD.md
│   ├── 02-ARCHITECTURE.md
│   ├── 03-WORKFLOW.md
│   ├── 04-DATABASE.md
│   ├── 05-API.md
│   ├── 06-SECURITY.md
│   ├── 07-ROADMAP.md
│   ├── 08-DEPLOYMENT.md
│   └── 09-TASKS.md
├── apps/
│   ├── web/          # React + TypeScript frontend
│   └── api/           # Node.js + Express + TypeScript backend
├── packages/
│   └── shared-types/  # Shared TS types between web & api
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts           # reads seed-data.ts, upserts DB
│   └── seed-data.ts       # full 12-category / 196-disease taxonomy (content TBD)
├── .github/
│   └── workflows/     # CI/CD pipelines
└── .env.example
```

## Quick Start (once code exists)

```bash
git clone https://github.com/<tamiruyadetan-sketch>/health-portal.git
cd health-portal
npm install
cp .env.example .env
npm run dev
```

## Reading Order

Read the docs in `docs/` in this order: PRD → Architecture → Workflow → Database → API → Security → Roadmap → Deployment.

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Routing | React Router v6 |
| State/data fetching | TanStack Query (React Query) |
| Styling | Tailwind CSS |
| i18n | react-i18next (English / Afaan Oromoo) |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| AI | Claude API (Anthropic) via backend proxy |
| Hosting (FE) | Vercel |
| Hosting (BE) | Render / Railway |
| Hosting (DB) | Neon / Supabase (managed Postgres) |
| CI/CD | GitHub Actions |

## Disclaimer

This platform provides **general health education content only**. It is not a
diagnostic tool and does not replace professional medical advice. This principle
is enforced throughout the AI assistant's system prompt and UI (see `06-SECURITY.md`).
=======
# Health-assistant
This website are detail explain types and about disease
>>>>>>> 0cf9df63c88cea5a4b97486d8acb271b5e150fd2
