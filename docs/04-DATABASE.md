# Database Design (PostgreSQL + Prisma)

## 1. Approach to Bilingual Content

Rather than duplicating whole tables per language, each translatable
table has a matching `*_translations` table keyed by `(entity_id, locale)`.
This keeps the core structure (relations, ordering, IDs) in one place and
makes adding a third language later trivial.

`locale` is one of: `en`, `om`.

## 2. Entity-Relationship Overview

**Important modeling decision**: categories ↔ diseases is **many-to-many**,
not one-to-many. Of the confirmed 196-disease taxonomy, 6 diseases
genuinely belong to two categories (e.g. Tuberculosis appears under both
Respiratory and Infectious Diseases; Sinusitis under both Respiratory and
ENT). A single `categoryId` foreign key on `Disease` can't represent that
without duplicating the disease row — so a join table (`DiseaseCategory`)
is used instead.

```
categories *───* diseases   (via disease_categories join table)
                     │
                     ├──1 disease_symptoms (one row per disease, per locale)
                     │
                     ├──1 disease_food_items (one row per disease, per locale;
                     │      split into recommended[] / avoid[])
                     │
                     └──* chat_messages (optional logging, anonymized)

categories ──* category_translations (locale)
diseases ──* disease_translations (locale: whatIsIt, causes, howAcquired,
                                     prevention, whenToSeeDoctor)
```

Symptoms and food items are stored as **string arrays directly on the
translation row** (Postgres `text[]`) rather than as separate child
tables — a disease's symptom list and food lists are always read/written
as a whole unit per language, never queried symptom-by-symptom, so a
child table with its own translation table (as in the original draft)
was unnecessary indirection. This also matches the seed data shape in
`prisma/seed-data.ts`.

## 3. Prisma Schema (excerpt)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Locale {
  en
  om
}

model Category {
  id            String   @id @default(uuid())
  slug          String   @unique
  icon          String?  // icon name/emoji for nav
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())

  translations  CategoryTranslation[]
  diseases      DiseaseCategory[]
}

model CategoryTranslation {
  id         String   @id @default(uuid())
  categoryId String
  locale     Locale
  name       String

  category   Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@unique([categoryId, locale])
}

model Disease {
  id            String   @id @default(uuid())
  slug          String   @unique
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  categories    DiseaseCategory[]
  translations  DiseaseTranslation[]
}

// Join table: a disease can belong to 1+ categories
// (e.g. Tuberculosis -> Respiratory Diseases + Infectious Diseases)
model DiseaseCategory {
  diseaseId   String
  categoryId  String

  disease     Disease  @relation(fields: [diseaseId], references: [id], onDelete: Cascade)
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([diseaseId, categoryId])
  @@index([categoryId])
}

model DiseaseTranslation {
  id              String   @id @default(uuid())
  diseaseId       String
  locale          Locale
  name            String
  whatIsIt        String   @db.Text  // "What is it?"
  causes          String   @db.Text  // "What causes this disease?"
  howAcquired     String   @db.Text  // "How does a person become affected?" (transmission/mechanism)
  prevention      String   @db.Text  // "How can it be prevented?"
  whenToSeeDoctor String?  @db.Text
  symptoms          String[] // "What are the symptoms?"
  foodsRecommended  String[] // "What foods should be eaten?"
  foodsToAvoid      String[] // "What foods should be avoided?"

  disease         Disease  @relation(fields: [diseaseId], references: [id], onDelete: Cascade)

  @@unique([diseaseId, locale])
}

// Optional: anonymized chat logs for quality monitoring (see Security doc)
model ChatMessage {
  id          String   @id @default(uuid())
  sessionId   String   // random client-generated id, not tied to a user account
  diseaseSlug String
  locale      Locale
  role        String   // "user" | "assistant"
  content     String   @db.Text
  createdAt   DateTime @default(now())

  @@index([sessionId])
  @@index([diseaseSlug])
}

// Optional, for Phase 4 (auth / favorites)
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())

  favorites    Favorite[]
}

model Favorite {
  id         String   @id @default(uuid())
  userId     String
  diseaseId  String
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, diseaseId])
}
```

## 4. Indexing Notes

- `slug` columns are unique + indexed automatically — used for URL
  lookups (`/disease/anemia`), so keep them short and URL-safe.
- `(entity_id, locale)` unique composite indexes double as the lookup
  index for "give me this disease in this language."
- `DiseaseCategory` is indexed on `categoryId` so building a category's
  dropdown (all diseases in that category) is a fast lookup; the
  composite primary key `(diseaseId, categoryId)` covers the reverse
  lookup (all categories for a disease).
- Add a `@@index([diseaseSlug])` on `ChatMessage` (included above) if
  you ever want per-disease analytics on what people ask.

## 5. Seeding

- **`prisma/seed-data.ts`** — the actual data file, already generated
  from the confirmed taxonomy: all 12 categories and all 196 unique
  diseases, each with its `categorySlugs[]` (length 2 for the 6
  cross-category diseases, length 1 for the rest). Content fields
  (`whatIsIt`, `causes`, `howAcquired`, `prevention`, `symptoms`,
  `foodsRecommended`, `foodsToAvoid`) are scaffolded but **left blank —
  this is where the content-authoring workflow (see `03-WORKFLOW.md`
  §4) fills in the medically-reviewed EN and OM text** before launch.
- **`prisma/seed.ts`** (to write) — reads `seed-data.ts`, upserts
  `Category`/`CategoryTranslation` rows, then `Disease`/
  `DiseaseTranslation`/`DiseaseCategory` rows, so `npx prisma db seed`
  gives a fresh clone of the repo the full working nav structure
  immediately, even before content is filled in (pages will just show
  empty sections until authored).
