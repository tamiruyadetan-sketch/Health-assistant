# Architecture

## 1. High-Level Diagram

```
┌───────────────────────┐          ┌────────────────────────┐
│   React + TypeScript  │  HTTPS   │   Express + TypeScript  │
│   (Vite, SPA)          │ ───────▶ │   REST API              │
│   Vercel                │ ◀─────── │   Render/Railway         │
└───────────────────────┘   JSON   └────────────┬─────────────┘
     │  react-i18next                             │ Prisma ORM
     │  React Query cache                          ▼
     │                                    ┌────────────────────┐
     │                                    │  PostgreSQL          │
     │                                    │  (Neon/Supabase)     │
     │                                    └────────────────────┘
     │                                             │
     │                                             ▼
     │                                    ┌────────────────────┐
     └── AI Chat widget  ────────────────▶│  Claude API (proxy) │
         (never calls LLM directly)        │  via /api/ai/chat   │
                                            └────────────────────┘
```

The frontend **never** calls the AI provider directly. All AI traffic goes
`Browser → our API → LLM provider → our API → Browser`, so the API key
stays server-side and we can rate-limit, log, and moderate.

## 2. Frontend (apps/web)

- **React 18 + TypeScript**, built with **Vite**.
- **React Router v6** for routing:
  - `/` Home
  - `/disease/:slug` Disease detail
  - `/category/:slug` Category listing (fallback for direct links / mobile)
  - `/about`
- **TanStack Query** for fetching/caching categories, diseases, and disease
  detail from the API (avoids manual loading-state spaghetti).
- **react-i18next** for bilingual strings; language-tagged DB content is
  fetched with a `?lang=en|om` query param instead of duplicating routes.
- **Tailwind CSS** for styling, with a dark-mode class strategy
  (`darkMode: 'class'`) toggled by the brightness button.
- **Component structure** (indicative):
  ```
  src/
    components/
      NavBar/              (top bar + hover dropdown)
      UtilityBar/           (brightness, about, language)
      DiseaseCard/
      SymptomList/
      FoodList/
      ChatWidget/
    pages/
      Home.tsx
      DiseaseDetail.tsx
      CategoryList.tsx
      About.tsx
    hooks/
      useCategories.ts
      useDisease.ts
      useChat.ts
    i18n/
      en.json
      om.json
    context/
      ThemeContext.tsx
      LanguageContext.tsx
  ```
- **Responsiveness**: mobile-first Tailwind breakpoints; nav dropdown is
  hover-triggered on desktop (`≥ md`) and tap/accordion-triggered on mobile.

## 3. Backend (apps/api)

- **Node.js + Express + TypeScript**, layered:
  ```
  src/
    routes/          (Express routers, thin)
    controllers/      (request/response glue)
    services/         (business logic: diseaseService, aiService)
    repositories/      (Prisma queries)
    middleware/        (auth, rateLimiter, errorHandler, validation)
    prisma/            (client singleton)
    config/
    app.ts
    server.ts
  ```
- Prisma as the ORM/query layer over PostgreSQL (see `04-DATABASE.md`).
- `aiService` builds a disease-scoped system prompt, calls the LLM API,
  and returns a plain-text/structured answer. See `05-API.md`.
- Stateless API (no server-side sessions) — any auth added later uses JWT.

## 4. Why this stack

- **Single language (TypeScript) end-to-end** — shared types between
  frontend and backend via `packages/shared-types`, fewer bugs at the
  API boundary.
- **Express** — simple, well-understood, easy for a solo/small team to
  reason about vs. a heavier framework; can migrate to NestJS later if
  the team grows and wants stronger structure/DI.
- **Prisma + PostgreSQL** — relational data (categories → diseases →
  symptoms/food lists) fits a relational schema naturally; Prisma gives
  type-safe queries matching the TS-everywhere approach.
- **Backend-proxied AI calls** — required for API key security and to
  enforce moderation/rate-limits/disclaimers server-side, not trust the
  client.

## 5. Environments

| Env | Frontend | Backend | DB |
|---|---|---|---|
| Local dev | Vite dev server | `ts-node-dev` / `nodemon` | local Postgres or Neon dev branch |
| Staging | Vercel preview | Render/Railway staging service | Neon/Supabase staging branch |
| Production | Vercel production | Render/Railway production service | Neon/Supabase production |

## 6. Cross-Cutting Concerns

- **i18n**: static strings in frontend JSON files; dynamic (DB) content
  stored with per-locale columns/tables (see database doc).
- **Theming**: CSS variables + Tailwind `dark:` classes, persisted in
  `localStorage`.
- **Error handling**: centralized Express error middleware returning a
  consistent `{ error: { code, message } }` shape; frontend shows a
  friendly toast/banner.
- **Logging**: structured logs (e.g., `pino`) on the backend; no PII or
  full chat content logged in production by default (see Security doc).
