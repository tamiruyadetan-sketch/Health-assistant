# Security

## 1. General Web Security

- All traffic over **HTTPS** (enforced by Vercel/Render/Railway by default).
- **CORS**: backend only allows the known frontend origin(s)
  (`https://yourdomain.com`, plus Vercel preview URLs during staging).
- **Helmet.js** on Express for standard secure headers (CSP, X-Frame-Options,
  etc.).
- **Input validation** on every endpoint (e.g., `zod`) — reject malformed
  `slug`, `lang`, or oversized `message` fields before they hit business
  logic.
- **SQL injection**: mitigated by using Prisma's parameterized queries
  exclusively — never string-concatenate raw SQL.
- **XSS**: React escapes output by default; never use `dangerouslySetInnerHTML`
  with unsanitized content (e.g., AI replies) — render as plain text/markdown
  through a sanitizing renderer if you support markdown formatting in
  answers.

## 2. AI Endpoint Specific

- **API key custody**: the LLM provider API key lives only in the backend's
  environment variables (`ANTHROPIC_API_KEY`), never sent to or readable by
  the frontend. Frontend only ever talks to `/api/ai/chat`.
- **Rate limiting**: per-IP and per-`sessionId` limits on `/api/ai/chat`
  (e.g., `express-rate-limit`) to control cost and abuse — e.g. 20
  requests / 10 minutes.
- **Prompt scoping**: system prompt restricts the assistant to the
  selected disease's topic, instructs it to:
  - Never diagnose, prescribe, or give dosages.
  - Always include a short "consult a professional" reminder for
    personal-advice-shaped questions.
  - Politely decline and redirect if asked about unrelated diseases,
    with a suggestion to navigate to that disease's page instead.
- **Input length caps**: reject/trim messages beyond a max length (e.g.,
  2000 chars) before sending to the LLM, to control cost and abuse.
- **Output moderation**: log a warning (and optionally block) if a
  response appears to include prescriptive dosage/diagnosis language,
  as a backstop to the system prompt.

## 3. Data Privacy

- No account is required to use the core product (browse + chat) in v1 —
  minimizes personal data collected.
- `ChatMessage` logging (if enabled) uses a random client-generated
  `sessionId`, not an email/IP/name — treat chat content as sensitive
  regardless, since users may describe personal symptoms.
- Provide a visible **disclaimer** (in both languages) on every disease
  page and in the chat widget: "This is general information, not a
  medical diagnosis."
- If auth/accounts are added later (Phase 4): hash passwords with
  `bcrypt`/`argon2`, use short-lived JWT access tokens + refresh tokens,
  never store plaintext passwords or tokens in logs.
- Comply with applicable data protection expectations for health-adjacent
  content — avoid collecting or storing identifiable health records; keep
  the product scoped to general education, not personal health tracking,
  to sidestep most regulated-health-data obligations (re-evaluate if you
  later add personal health record features).

## 4. Environment & Secrets

- `.env` files git-ignored; `.env.example` checked in with placeholder
  keys only.
- Secrets (DB URL, LLM API key, JWT secret) set via the hosting
  platform's secret manager (Vercel/Render/Railway env vars), not
  committed anywhere.
- Rotate the LLM API key if it's ever exposed (e.g., accidentally
  committed) — treat as a hard incident, not a warning.

## 5. Dependency & Infra Hygiene

- `npm audit` / Dependabot enabled on the GitHub repo.
- Pin major versions; review breaking changes before upgrading Prisma,
  Express, React majors.
- Database backups: rely on managed Postgres provider's automatic
  backups (Neon/Supabase) — verify restore works at least once before
  launch.

## 6. Abuse & Availability

- Basic bot/abuse protection on `/api/ai/chat` (rate limit + optional
  CAPTCHA if abuse is observed post-launch).
- Timeouts on the LLM call (e.g., 15s) with a graceful "assistant is
  busy, try again" fallback in the UI rather than an infinite spinner.
