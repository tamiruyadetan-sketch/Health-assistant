# Task Breakdown — Frontend / Backend / Database / API

This breaks the project (see `01-PRD.md` → `08-DEPLOYMENT.md`) into concrete,
assignable work items per discipline. Each task lists **what to build** and
**what "done" looks like**, so it can be turned directly into GitHub Issues.
Order within each section is roughly build order, not priority — cross-check
against `07-ROADMAP.md` phases when scheduling.

---

## 1. FRONTEND (`apps/web`)

### 1.1 Project Setup
- [ ] **Scaffold app**: `npm create vite@latest apps/web -- --template react-ts`.
      Done when `npm run dev` shows the default Vite page.
- [ ] **Install & configure Tailwind CSS**, with `darkMode: 'class'` in
      `tailwind.config.ts`. Done when a `dark:` utility class visibly
      changes styling with `<html class="dark">` toggled manually.
- [ ] **ESLint + Prettier** config shared with backend (same root config
      if using a monorepo). Done when `npm run lint` runs clean on a
      fresh scaffold and CI fails on a deliberately broken rule.
- [ ] **Folder structure**: create `components/`, `pages/`, `hooks/`,
      `i18n/`, `context/`, `types/` per `02-ARCHITECTURE.md` §2.
- [ ] **Install React Router v6, TanStack Query, react-i18next, axios
      (or fetch wrapper)**.
- [ ] **API client wrapper** (`src/lib/apiClient.ts`) — base URL from
      `VITE_API_BASE_URL`, typed via `packages/shared-types`, central
      error handling (throws a typed `ApiError`).

### 1.2 Theming (Brightness Toggle)
- [ ] **`ThemeContext`** — `theme: 'light' | 'dark'`, `toggleTheme()`,
      reads/writes `localStorage.theme`, applies/removes `dark` class on
      `<html>` on mount and on toggle. Done when reloading the page
      preserves the last-selected theme with no flash of wrong theme
      (set the class before React hydrates, e.g. in `index.html` inline
      script).
- [ ] **Brightness button component** in the utility bar, icon swaps
      sun/moon based on current theme, `aria-label` set correctly.

### 1.3 Internationalization (EN / Afaan Oromoo)
- [ ] **react-i18next setup**: `i18n/en.json`, `i18n/om.json` for all
      static UI strings (nav labels, buttons, disclaimer text, empty
      states, error messages).
- [ ] **`LanguageContext`** — current locale, `setLocale()`, persists to
      `localStorage.lang`, drives both `i18next.changeLanguage()` and the
      `?lang=` query param used in API calls.
- [ ] **Language switcher component** — dropdown/toggle in the utility
      bar (EN / Afaan Oromoo), updates immediately without a full page
      reload.
- [ ] **Verify no hardcoded strings**: done when a full click-through of
      the site in `om` locale shows zero leftover English UI strings
      (DB content strings depend on content authoring — tracked
      separately in Database §3.4).

### 1.4 Top Navigation Bar
- [ ] **`NavBar` shell** — sticky, responsive container holding the 12
      category items + the utility bar.
- [ ] **`useCategories()` hook** (React Query) — fetches
      `GET /categories`, cached, includes each category's disease list
      for dropdown rendering.
- [ ] **Desktop hover dropdown** — `onMouseEnter`/`onMouseLeave` (with
      ~150ms close delay), one dropdown open at a time, closes on
      outside click and on `Escape`.
- [ ] **Mobile accordion dropdown** — tap expands/collapses in place;
      only one category open at a time; scrollable if the disease list
      is long.
- [ ] **Keyboard accessibility** — nav items reachable via `Tab`,
      dropdown openable with `Enter`/`Space`, closable with `Escape`,
      focus returns to the trigger on close.
- [ ] **Cross-category disease handling** — verify a disease belonging
      to two categories (e.g. Tuberculosis) correctly appears in *both*
      dropdowns and both links resolve to the same `/disease/tuberculosis`
      page.
- [ ] **About modal/page + button** — static content (mission, team,
      contact, disclaimer), bilingual.

### 1.5 Home Page
- [ ] **Hero section** — short intro copy, bilingual.
- [ ] **Category grid** — cards mirroring nav categories, for
      no-hover-needed mobile browsing; clicking a card goes to
      `/category/:slug`.
- [ ] **Search bar** — debounced input calling
      `GET /diseases?search=`, shows a dropdown of matching disease
      names with category context, keyboard-navigable
      (arrow keys + Enter).

### 1.6 Category Listing Page (`/category/:slug`)
- [ ] Fallback page for direct links / mobile deep links: category name
      + full list of diseases in that category as tappable cards.

### 1.7 Disease Detail Page (`/disease/:slug`)
- [ ] **`useDisease(slug, lang)` hook** — fetches `GET /diseases/:slug`.
- [ ] **Section components**: `WhatIsIt`, `Causes`, `HowAcquired`,
      `Prevention`, `SymptomList`, `FoodList` (recommended/avoid
      variants), `WhenToSeeDoctor` — each renders the corresponding
      field from the API response, in the current locale.
- [ ] **Loading/skeleton state** while fetching.
- [ ] **Empty-content handling** — if a field is still blank (content
      not authored yet), section is hidden rather than showing an empty
      heading.
- [ ] **404 handling** — invalid slug shows a friendly "disease not
      found" page with a link back to categories.
- [ ] **Breadcrumb** — Home → Category → Disease name, category link
      uses the disease's *primary* category if it belongs to two.

### 1.8 AI Chat Widget
- [ ] **`useChat(diseaseSlug, lang)` hook** — manages message list,
      generates/persists a `sessionId` (e.g. `crypto.randomUUID()`,
      stored in `sessionStorage` so it resets per browser session), calls
      `POST /ai/chat`.
- [ ] **`ChatWidget` UI** — message bubbles (user vs. assistant), input
      box with send button + Enter-to-send, loading indicator while
      awaiting a reply, disabled input while a request is in flight.
- [ ] **Disclaimer banner** — always visible above/below the widget, in
      the current locale.
- [ ] **Error state** — timeout or API error shows a retry-friendly
      message, not a raw error or infinite spinner.
- [ ] **Rate-limit UX** — if the backend returns 429, show a clear
      "please wait a moment" message rather than a generic error.
- [ ] **Input length guard** — client-side max-length matching the
      backend cap, with a visible character counter near the limit.

### 1.9 Cross-Cutting Frontend Work
- [ ] **Error boundary** — top-level React error boundary with a
      friendly fallback UI.
- [ ] **404 route** for unknown paths.
- [ ] **SEO basics** — per-page `<title>` and meta description
      (disease name + short description), done via `react-helmet-async`
      or Vite's native head management.
- [ ] **Responsive QA pass** — manually verify at 375px, 768px, 1024px,
      1440px breakpoints; nav dropdown, chat widget, and food lists in
      particular tend to break first.
- [ ] **Accessibility pass** — color contrast (light + dark), alt text
      on any icons/images, focus states visible, screen-reader labels
      on icon-only buttons (brightness, language, search).
- [ ] **Performance pass** — route-based code splitting
      (`React.lazy`), image optimization if any images are added,
      target Lighthouse mobile ≥ 90.
- [ ] **Component tests** (React Testing Library) — NavBar dropdown
      open/close, LanguageContext switching, ChatWidget send/receive
      flow with a mocked API.
- [ ] **E2E tests** (Playwright or Cypress) — one full happy path:
      home → hover/tap category → select disease → read content →
      send a chat message → see a reply.

---

## 2. BACKEND (`apps/api`)

### 2.1 Project Setup
- [ ] **Scaffold**: Express + TypeScript, `ts-node-dev` for local dev,
      `tsc` build for production. Done when `GET /health` returns
      `200 { status: "ok" }` locally.
- [ ] **Folder structure** per `02-ARCHITECTURE.md` §3: `routes/`,
      `controllers/`, `services/`, `repositories/`, `middleware/`,
      `config/`.
- [ ] **Env config loader** (e.g. `zod`-validated `config/env.ts`) that
      fails fast at startup if `DATABASE_URL`, `ANTHROPIC_API_KEY`, or
      `CORS_ORIGIN` are missing — never falls back to silent defaults
      for these.
- [ ] **Structured logging** (`pino` or similar), request-id per
      request for traceability.

### 2.2 Core Middleware
- [ ] **CORS** — locked to `CORS_ORIGIN` env value(s), credentials
      config decided (likely `false`, no cookies in v1).
- [ ] **Helmet** — standard secure headers enabled.
- [ ] **Request validation middleware** — `zod` schemas per route,
      rejects malformed `slug`/`lang`/`message` before reaching
      controllers.
- [ ] **Centralized error handler** — catches thrown errors, returns the
      standard `{ error: { code, message } }` shape from `05-API.md`,
      logs server errors, never leaks stack traces in production
      responses.
- [ ] **Rate limiter** — general baseline limiter on all routes, plus a
      stricter one specifically on `/ai/chat` (see §2.5).

### 2.3 Categories Module
- [ ] **`GET /categories`** — returns all categories with nested disease
      lists (slug + localized name), respecting `?lang=`. Done when the
      response matches the shape in `05-API.md` §1 and includes
      cross-category diseases correctly under each of their categories.
- [ ] **`GET /categories/:slug`** — single category + its diseases;
      404 with `CATEGORY_NOT_FOUND` if slug doesn't exist.
- [ ] **`categoryRepository`** — Prisma queries joining through
      `DiseaseCategory`, sorted by `sortOrder`.

### 2.4 Diseases Module
- [ ] **`GET /diseases/:slug`** — full detail response per `05-API.md`
      §2, including the `categories[]` array (1 or 2 entries). 404 with
      `DISEASE_NOT_FOUND` if slug doesn't exist.
- [ ] **`GET /diseases?search=`** — case-insensitive partial match on
      disease name (localized), returns lightweight
      `{ slug, name, categorySlugs }[]`, capped at ~10 results.
- [ ] **`diseaseRepository`** — Prisma queries against
      `Disease` + `DiseaseTranslation` + `DiseaseCategory`.

### 2.5 AI Assistant Module
- [ ] **`aiProvider` interface** — thin abstraction
      (`generateReply(systemPrompt, history, message): Promise<string>`)
      so the underlying LLM (Claude API to start) can be swapped without
      touching route/controller code.
- [ ] **Claude API integration** — calls `/v1/messages` with the model
      chosen for cost/latency (e.g. a fast model for this use case),
      server-side API key only, timeout (~15s) with a clean error on
      timeout.
- [ ] **System prompt builder** — pulls the disease's canonical
      `whatIsIt` / `causes` / `howAcquired` / `prevention` / `symptoms`
      / food lists from the DB (grounding), and composes a prompt that:
      instructs the assistant to stay scoped to this disease, answer in
      the requested locale, never diagnose/prescribe/give dosages,
      and always include a short "consult a professional" reminder
      when the question is personal-advice-shaped.
- [ ] **`POST /ai/chat`** controller — validates body, loads disease
      context, calls the AI service, returns `{ reply, disclaimer }`
      per `05-API.md` §3.
- [ ] **Rate limiting** — per `sessionId` and per IP (e.g. 20 msgs /
      10 min), returns `429` with a clear error code when exceeded.
- [ ] **Optional chat logging** — writes `{sessionId, diseaseSlug,
      locale, role, content}` to `ChatMessage` if logging is enabled;
      gate behind an env flag so it can be disabled entirely for
      privacy-sensitive deployments.
- [ ] **Output sanity check** — lightweight backend check (keyword flag
      or a cheap follow-up moderation pass) that logs a warning if a
      reply looks like it contains dosage/diagnosis language, as a
      backstop to the prompt.

### 2.6 Health & Misc
- [ ] **`GET /health`** — used by uptime monitors and the hosting
      platform's health check.
- [ ] **404 handler** for unknown routes, consistent error shape.

### 2.7 Testing
- [ ] **Unit tests** — `diseaseService`, `categoryService`, and
      especially `aiService`'s prompt-building logic (mock the LLM
      call).
- [ ] **Integration tests** — spin up against a test database (or
      Prisma's test-container pattern), hit real routes for
      categories/diseases; mock the Claude API call for `/ai/chat`
      tests.
- [ ] **Load/rate-limit test** — confirm the `/ai/chat` limiter actually
      trips at the configured threshold.

---

## 3. DATABASE (PostgreSQL + Prisma)

### 3.1 Schema Implementation
- [ ] **Write `prisma/schema.prisma`** exactly per `04-DATABASE.md`:
      `Category`, `CategoryTranslation`, `Disease`, `DiseaseCategory`
      (join table), `DiseaseTranslation`, `ChatMessage`, and the
      optional `User`/`Favorite` pair (can be added later without
      breaking anything already built).
- [ ] **Provision databases** — local dev Postgres (or a Neon/Supabase
      dev branch), a staging branch, a production project.
- [ ] **Initial migration** — `npx prisma migrate dev --name init`,
      commit the generated migration folder.
- [ ] **Verify indexes** — `slug` uniqueness, `(entityId, locale)`
      uniqueness on translation tables, `DiseaseCategory` composite PK
      + `categoryId` index, all present after migration.

### 3.2 Seeding Infrastructure
- [ ] **`prisma/seed-data.ts`** — already generated (12 categories, 196
      unique diseases, correct `categorySlugs[]` per disease including
      the 6 cross-category ones). No further work needed on structure —
      only on filling content (§3.4).
- [ ] **`prisma/seed.ts`** — write the script that:
      1. Upserts all `Category` rows + `CategoryTranslation` (en/om).
      2. Upserts all `Disease` rows.
      3. Upserts `DiseaseCategory` join rows per disease's
         `categorySlugs`.
      4. Upserts `DiseaseTranslation` rows (en/om) from each disease's
         content fields.
      Wire it to `package.json`'s `prisma.seed` config so
      `npx prisma db seed` just works.
- [ ] **Idempotency check** — running `db seed` twice in a row doesn't
      duplicate rows or error (use `upsert` keyed on `slug`/
      `(id, locale)`, not `create`).

### 3.3 Data Integrity Rules
- [ ] **Slug format constraint** — enforce lowercase-kebab-case at the
      application layer (validation before insert) even though Postgres
      itself won't enforce the pattern.
- [ ] **Required-field policy** — decide and document: can a
      `DiseaseTranslation` be inserted with empty-string content fields
      (allowing incremental content authoring), or must it be
      all-or-nothing per locale before a disease "goes live"? (Given the
      196-disease scope, incremental is strongly recommended — pair
      with a `publishedAt` or `isComplete` flag on `DiseaseTranslation`
      if you want the frontend to hide unfinished disease pages rather
      than show partial content.)
- [ ] **Cascade behavior review** — confirm `onDelete: Cascade` on
      translation/join tables is actually what you want (deleting a
      `Disease` deletes its translations and category links, not the
      categories themselves).

### 3.4 Content Authoring (tracked as data work, not code)
- [ ] **Populate `seed-data.ts` content fields** — for each of the 196
      diseases: `whatIsIt`, `causes`, `howAcquired`, `prevention`,
      `symptoms[]`, `foodsRecommended[]`, `foodsToAvoid[]`, in both
      `en` and `om`. This is the single largest work item in the whole
      project and should be tracked disease-by-disease (e.g. one
      checklist row or ticket per disease, or per category batch),
      not as one monolithic task. See `07-ROADMAP.md` for sequencing
      options.
- [ ] **Medical accuracy review** — each disease's EN content reviewed
      by someone with relevant health knowledge before publishing.
- [ ] **Afaan Oromoo translation review** — each disease's OM content
      reviewed by a fluent speaker, not machine-translation-only.
- [ ] **Re-seed after content updates** — confirm the upsert-based
      `seed.ts` can be re-run safely whenever content is added/edited,
      without needing a full DB reset.

### 3.5 Operations
- [ ] **Backup verification** — confirm automatic backups are enabled
      on the managed Postgres provider and do one test restore before
      launch.
- [ ] **Chat log retention** (if `ChatMessage` logging is enabled) —
      decide a retention window (e.g. 90 days) and set up a scheduled
      job/cron to purge older rows.

---

## 4. API (Contract & Cross-Cutting)

*(Backend §2 covers implementing these; this section is the contract-level
work that both frontend and backend depend on.)*

- [ ] **`packages/shared-types`** — define TypeScript interfaces for
      every request/response shape in `05-API.md` (`CategoryDTO`,
      `DiseaseDetailDTO`, `ChatRequest`, `ChatResponse`, `ApiError`),
      imported by both `apps/web` and `apps/api` so a shape change can't
      silently drift between the two.
- [ ] **Error code registry** — a single source of truth (e.g. a `const`
      object/enum) for error codes like `DISEASE_NOT_FOUND`,
      `CATEGORY_NOT_FOUND`, `RATE_LIMITED`, `VALIDATION_ERROR`, used by
      both the backend (to throw) and frontend (to branch UI behavior).
- [ ] **API versioning decision** — confirm whether to prefix routes
      with `/v1` now (recommended before any public consumers exist) or
      defer; document the decision.
- [ ] **OpenAPI spec (optional but recommended)** — generate or
      hand-write an `openapi.yaml` from the routes, useful for
      onboarding, Postman import, and catching contract drift in CI.
- [ ] **Postman/Thunder Client collection** — manual test collection
      covering every endpoint + the AI chat happy path and its error
      cases (invalid slug, oversized message, rate-limit trip).
- [ ] **CORS contract** — confirm allowed origins list covers local dev,
      Vercel preview URLs, and production domain, documented in
      `06-SECURITY.md` and kept in sync with actual env values.
- [ ] **Response time budget** — document expected p50/p95 latency per
      endpoint (e.g. `/categories` < 200ms, `/ai/chat` < 4s median) so
      regressions are noticeable, not just "it works."

---

## Suggested Ticket Granularity

For GitHub Issues, each checkbox above maps roughly 1:1 to one issue.
Group by section number as GitHub milestones/labels
(`frontend`, `backend`, `database`, `api`) and cross-reference the
Roadmap phase (`phase-1`, `phase-2`, etc.) as a second label so you can
filter "what's left for this phase" across all four disciplines at once.
