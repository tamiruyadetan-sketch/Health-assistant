# API Specification

Base URL: `https://api.yourdomain.com/api` (v1 implied; add `/v1` prefix
if you want explicit versioning from day one — recommended).

All list/detail endpoints accept `?lang=en|om` (default `en`).

## 1. Categories

### `GET /categories`
Returns all categories with their diseases (for building the nav dropdown
in one call).

```json
[
  {
    "slug": "blood-disease",
    "name": "Blood Disease",
    "diseases": [
      { "slug": "anemia", "name": "Anemia" },
      { "slug": "leukemia", "name": "Leukemia" }
    ]
  }
]
```

### `GET /categories/:slug`
Returns one category with its disease list (used by `/category/:slug`
fallback page).

## 2. Diseases

### `GET /diseases/:slug`
Full detail for a disease page. Note `categories` is an array — a disease
like Tuberculosis returns both Respiratory Diseases and Infectious
Diseases, since the schema is many-to-many (see `04-DATABASE.md`).

```json
{
  "slug": "tuberculosis",
  "categories": [
    { "slug": "respiratory-diseases", "name": "Respiratory Diseases" },
    { "slug": "infectious-diseases", "name": "Infectious Diseases" }
  ],
  "name": "Tuberculosis",
  "whatIsIt": "...",
  "causes": "...",
  "howAcquired": "...",
  "prevention": "...",
  "symptoms": ["Persistent cough", "Night sweats", "Weight loss"],
  "foodsRecommended": ["Protein-rich foods", "Iron-rich foods"],
  "foodsToAvoid": ["Alcohol", "Excess caffeine"],
  "whenToSeeDoctor": "..."
}
```

### `GET /diseases?search=<query>`
Search-as-you-type for the home page search bar; returns
`[{ slug, name, categorySlug }]`.

## 3. AI Assistant

### `POST /ai/chat`

Request:
```json
{
  "diseaseSlug": "anemia",
  "sessionId": "client-generated-uuid",
  "lang": "en",
  "message": "Can I eat spinach every day?"
}
```

Response:
```json
{
  "reply": "Yes, spinach is generally a good source of iron for anemia... [continues, ends with a short reminder to consult a doctor for personal advice]",
  "disclaimer": "This is general information, not medical advice."
}
```

Server-side behavior (see `06-SECURITY.md` for full detail):
1. Validate `diseaseSlug` exists; fetch its canonical EN/OM content from
   the DB to ground the AI's answer.
2. Build a system prompt: role = health-education assistant, scope =
   this disease only, language = `lang`, must include a disclaimer,
   must refuse diagnosis/prescription requests and redirect to a
   professional.
3. Rate-limit per `sessionId`/IP (e.g., 20 messages / 10 min).
4. Call the LLM API (see §5).
5. Optionally persist `{sessionId, diseaseSlug, role, content}` to
   `ChatMessage` for quality monitoring (no account/PII attached).

### `GET /ai/chat/:sessionId/history` *(optional, if you want persisted
chat history in-session)*
Returns prior messages for that `sessionId` + `diseaseSlug`.

## 4. Misc

### `GET /health`
Simple liveness check for uptime monitors / deployment platform.

## 5. AI Provider Choice

**Recommendation: Anthropic Claude API** (e.g., `claude-sonnet-5` /
`claude-haiku-4-5` depending on cost/latency needs), called only from
the backend.

Why:
- Strong at following a scoped system prompt (stay on-topic, refuse
  diagnosis, keep a consistent disclaimer) — important for a health
  app where you want the assistant to reliably decline "what dose
  should I take" type questions.
- Good multilingual support, workable for English + Afaan Oromoo,
  though you should **test Afaan Oromoo quality directly** since it's
  a lower-resource language — have a native speaker review sample
  outputs before launch, and keep the option to fall back to showing
  the static (human-reviewed) page content if AI quality in Oromoo is
  weak for a given query.
- Simple REST API (`/v1/messages`), easy to proxy from Express.

Alternative you can swap in with the same proxy pattern: OpenAI's API.
Keep the LLM call behind a small `aiProvider` interface in
`services/aiService.ts` so swapping providers later is a one-file change.

## 6. Error Format

All errors:
```json
{ "error": { "code": "DISEASE_NOT_FOUND", "message": "No disease with that slug." } }
```
Standard HTTP status codes (`400`, `404`, `429`, `500`) alongside this body.
