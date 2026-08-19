/**
 * Shared types between apps/web and apps/api.
 * These mirror the contract documented in docs/05-API.md.
 */

/** Supported locales for bilingual content. */
export type Locale = 'en' | 'om';

/** Lightweight disease reference returned inside category lists / search. */
export interface DiseaseSummaryDTO {
  slug: string;
  name: string;
}

/** Category with its (localized) disease list — used to build the nav dropdown. */
export interface CategoryDTO {
  slug: string;
  name: string;
  icon?: string | null;
  diseases: DiseaseSummaryDTO[];
}

/** Category reference used inside a disease detail response (1..2 entries). */
export interface CategorySummaryDTO {
  slug: string;
  name: string;
}

/**
 * Full disease detail response from GET /diseases/:slug.
 * Text fields are localized via the `?lang=` query param.
 */
export interface DiseaseDetailDTO {
  slug: string;
  name: string;
  categories: CategorySummaryDTO[];
  whatIsIt: string;
  causes: string;
  howAcquired: string;
  prevention: string;
  symptoms: string[];
  foodsRecommended: string[];
  foodsToAvoid: string[];
  whenToSeeDoctor?: string | null;
}

/** One result from GET /diseases?search= */
export interface SearchResultDTO {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
}

/** Request body for POST /ai/chat */
export interface ChatRequest {
  diseaseSlug: string;
  sessionId: string;
  lang: Locale;
  message: string;
}

/** Response body for POST /ai/chat */
export interface ChatResponse {
  reply: string;
  disclaimer?: string;
}

/** Optional chat history entry for GET /ai/chat/:sessionId/history */
export interface ChatHistoryEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

/** Error codes used across the API — single source of truth for the frontend too. */
export const ERROR_CODES = {
  DISEASE_NOT_FOUND: 'DISEASE_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/** Standard API error body. */
export interface ApiErrorBody {
  error: {
    code: ErrorCode;
    message: string;
  };
}
