import type { CategoryDTO, Locale } from '@health-portal/shared-types';
import { findAllCategories, findCategoryBySlug } from '@/repositories/categoryRepository';
import { notFoundError } from '@/lib/errors';

export function getCategories(locale: Locale): CategoryDTO[] {
  return findAllCategories(locale);
}

export function getCategoryBySlug(slug: string, locale: Locale): CategoryDTO {
  const category = findCategoryBySlug(slug, locale);
  if (!category) {
    throw notFoundError('CATEGORY_NOT_FOUND', `No category with slug "${slug}".`);
  }
  return category;
}