# Workflow

## 1. User Flow — Browsing a Disease

```
Land on Home (/)
   │
   ├─ Desktop: hover "Blood Disease" in top nav
   │      └─ Dropdown appears → click "Anemia"
   │
   └─ Mobile: tap "Blood Disease" in top nav
          └─ Dropdown expands (accordion) → tap "Anemia"
              ▼
     Navigate to /disease/anemia?lang=en
              ▼
   Disease Detail Page renders:
     What is it? → Symptoms → Causes → Foods to eat →
     Foods to avoid → When to see a doctor → AI Chat widget
              ▼
   User types a question in the chat widget
              ▼
   POST /api/ai/chat { diseaseSlug: "anemia", message, lang }
              ▼
   Backend builds scoped system prompt → calls Claude API
              ▼
   Answer streamed/returned → rendered in chat widget
```

## 2. User Flow — Language & Theme

```
User clicks "Choose Language" → selects Afaan Oromoo
   → LanguageContext updates → localStorage.lang = "om"
   → All React Query calls re-fetch with ?lang=om
   → i18next re-renders static strings in Afaan Oromoo

User clicks brightness icon → ThemeContext toggles
   → <html class="dark"> toggled → localStorage.theme = "dark"
```

## 3. Navigation Dropdown Behavior (spec for devs)

- Desktop (`≥ md` breakpoint): `onMouseEnter` opens dropdown,
  `onMouseLeave` (with ~150ms delay to avoid flicker) closes it.
  Also openable/closable via keyboard (`Enter`/`Escape`) for
  accessibility.
- Mobile (`< md`): tap toggles an accordion-style expand/collapse;
  only one category open at a time to save vertical space.
- Each dropdown item is a real `<Link>` (crawlable, no JS-only nav).

## 4. Content Authoring Workflow

1. Disease content (definition, symptoms, foods) is drafted in a
   spreadsheet/CMS by the content team in **both** EN and OM.
2. Reviewed for medical accuracy (ideally by someone with a health
   background) and for translation quality.
3. Inserted into the database via seed scripts or an internal admin
   tool (see Roadmap — Phase 4 admin panel).
4. AI system prompts reference this same canonical content so the
   assistant's answers stay consistent with what's on the page.

## 5. Software Development Workflow

- **Branching**: trunk-based with short-lived feature branches.
  - `main` — always deployable.
  - `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- **PRs**: required before merging to `main`; CI must pass
  (lint, typecheck, tests, build).
- **CI/CD** (GitHub Actions):
  1. On PR: install → lint → typecheck → unit tests → build.
  2. On merge to `main`: build → deploy frontend to Vercel,
     backend to Render/Railway, run Prisma migrations.
- **Code review**: at least one approval before merge (or self-review
  checklist if solo).

## 6. Definition of Done (per feature)

- Works on mobile and desktop breakpoints.
- Available in both EN and OM (no hardcoded English strings).
- Dark mode styled correctly.
- No console errors/warnings.
- API errors handled gracefully in the UI.
- Accessible: keyboard-navigable nav dropdown, sufficient color contrast.
