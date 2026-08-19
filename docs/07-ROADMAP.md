# Roadmap

## Phase 0 — Setup (Week 1)
- Init monorepo (`apps/web`, `apps/api`, `packages/shared-types`).
- Set up PostgreSQL (Neon/Supabase), Prisma schema + migrations.
- Set up CI (lint/typecheck/build) on GitHub Actions.
- Base React app with routing, Tailwind, dark-mode scaffold.

## Phase 1 — MVP Content (Weeks 2–3)
- Implement the `Category` / `Disease` / `DiseaseCategory` many-to-many
  schema; run `prisma db seed` from `prisma/seed-data.ts` to load the
  full confirmed structure: **12 categories, 196 unique diseases**
  (English names/slugs only at first — content fields filled in
  progressively, not all-at-once).
- Prioritize content authoring for the most common ~30–40 diseases
  first (one per category as a template, then expand) rather than
  blocking launch on all 196 being fully written.
- `GET /categories`, `GET /diseases/:slug` endpoints.
- Home page with category grid + top nav (no dropdown yet, simple links
  okay as a first pass).
- Disease detail page (static sections, no AI yet).
- Deploy staging (frontend on Vercel, backend on Render/Railway).

## Phase 2 — Navigation, Theming, Bilingual (Weeks 4–5)
- Hover dropdown (desktop) + accordion dropdown (mobile) in top nav.
- Brightness toggle (dark/light) with persistence.
- Afaan Oromoo translations added to DB (`*_translations` tables) and
  frontend (`om.json` i18n bundle).
- "Choose Language" control wired to i18next + `?lang=` API param.
- About page/modal.

## Phase 3 — AI Assistant (Weeks 6–7)
- Backend `aiService` + `/api/ai/chat` endpoint, scoped system prompt,
  rate limiting.
- Chat widget UI on disease detail pages (EN + OM).
- Disclaimer copy in both languages.
- Manual QA pass on AI answers for a sample of diseases in both
  languages, especially checking it refuses diagnosis/dosage questions.

## Phase 4 — Polish & Optional Accounts (Weeks 8–9)
- Search bar (disease name autocomplete).
- Optional: user accounts + favorites (JWT auth, `User`/`Favorite`
  tables already in schema).
- Optional: lightweight internal admin tool for editing disease content
  without direct DB access.
- Accessibility pass (keyboard nav, screen reader labels, contrast).
- Performance pass (image optimization, code splitting, Lighthouse ≥ 90).

## Phase 5 — Launch & Monitor (Week 10+)
- Production deploy, custom domain, SSL.
- Error monitoring (e.g., Sentry) + uptime monitor on `/health`.
- Basic analytics (privacy-respecting, e.g., Plausible) to see which
  diseases/categories are most viewed — informs future content priority.
- Collect feedback from Afaan Oromoo speakers on translation quality
  and AI answer quality; iterate.

## Post-Launch Ideas (backlog, not committed)
- More categories/diseases, community-suggested topics.
- PWA/offline support for low-connectivity users.
- Voice input for the AI chat (useful for lower-literacy users).
- Additional local languages beyond EN/OM.
