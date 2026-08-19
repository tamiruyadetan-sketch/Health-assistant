import type { Locale } from '@health-portal/shared-types';
import { z } from 'zod';
import { validationError } from '@/lib/errors';

export const langSchema = z.enum(['en', 'om']).optional().default('en');

export const localeQuerySchema = z.object({
  lang: langSchema,
});

export const slugParamsSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase kebab-case.'),
});

export const searchQuerySchema = z.object({
  lang: langSchema,
  search: z.string().min(1).max(100).optional(),
});

export const chatBodySchema = z.object({
  diseaseSlug: z.string().min(1).max(200),
  sessionId: z.string().min(1).max(200),
  lang: z.enum(['en', 'om']).default('en'),
  message: z.string().trim().min(1, 'Message must not be empty.').max(2000, 'Message is too long (max 2000 characters).'),
});

export type LocaleQuery = { lang: Locale };
export type SearchQuery = { lang: Locale; search?: string };
export type ChatBody = z.infer<typeof chatBodySchema>;

export function parseLocaleQuery(value: unknown): Locale {
  const parsed = localeQuerySchema.safeParse(value);
  if (!parsed.success) {
    throw validationError(parsed.error.issues[0]?.message ?? 'Invalid "lang" query parameter.');
  }
  return parsed.data.lang;
}

export function parseSlugParam(value: unknown): string {
  const parsed = slugParamsSchema.safeParse({ slug: value });
  if (!parsed.success) {
    throw validationError(parsed.error.issues[0]?.message ?? 'Invalid slug.');
  }
  return parsed.data.slug;
}

export function parseSearchQuery(value: unknown): SearchQuery {
  const parsed = searchQuerySchema.safeParse(value);
  if (!parsed.success) {
    throw validationError(parsed.error.issues[0]?.message ?? 'Invalid query parameters.');
  }
  return parsed.data;
}

export function parseChatBody(value: unknown): ChatBody {
  const parsed = chatBodySchema.safeParse(value);
  if (!parsed.success) {
    throw validationError(parsed.error.issues[0]?.message ?? 'Invalid request body.');
  }
  return parsed.data;
}