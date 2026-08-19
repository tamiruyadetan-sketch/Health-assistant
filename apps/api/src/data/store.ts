import { categories as seedCategories, diseases as seedDiseases } from '../../../../prisma/seed-data';
import type { CategorySeed, DiseaseSeed } from '../../../../prisma/seed-data';
import type { Locale } from '@health-portal/shared-types';

export const CATEGORY_ICONS: Record<string, string> = {
  'skin-diseases': '🩹',
  'blood-diseases': '🩸',
  'heart-cardiovascular-diseases': '❤️',
  'respiratory-diseases': '🫁',
  'neurological-diseases': '🧠',
  'digestive-system-diseases': '🍽️',
  'musculoskeletal-diseases': '🦴',
  'infectious-diseases': '🦠',
  'endocrine-metabolic-diseases': '🧪',
  'kidney-urinary-diseases': '💧',
  'eye-diseases': '👁️',
  'ear-nose-throat-diseases': '👂',
};

export const DEFAULT_CATEGORY_ICON = '🩺';

const categoryBySlug = new Map<string, CategorySeed>(seedCategories.map((c) => [c.slug, c]));
const diseaseBySlug = new Map<string, DiseaseSeed>(seedDiseases.map((d) => [d.slug, d]));

/** Pick a localized string, falling back to English (then the first non-empty) when blank. */
export function localizeString(value: { en: string; om: string }, locale: Locale): string {
  if (locale === 'om' && value.om.trim()) return value.om;
  return value.en;
}

export function localizeList(value: { en: string[]; om: string[] }, locale: Locale): string[] {
  if (locale === 'om' && value.om.length > 0) return value.om;
  return value.en;
}

export function getCategory(slug: string): CategorySeed | undefined {
  return categoryBySlug.get(slug);
}

export function getDisease(slug: string): DiseaseSeed | undefined {
  return diseaseBySlug.get(slug);
}

export function getAllCategories(): CategorySeed[] {
  return [...categoryBySlug.values()];
}

export function getAllDiseases(): DiseaseSeed[] {
  return [...diseaseBySlug.values()];
}

export function getCategoryIcon(slug: string): string {
  return CATEGORY_ICONS[slug] ?? DEFAULT_CATEGORY_ICON;
}