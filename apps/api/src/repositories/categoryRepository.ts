import type { CategoryDTO, DiseaseSummaryDTO, Locale } from '@health-portal/shared-types';
import {
  getAllCategories,
  getAllDiseases,
  getCategory,
  getCategoryIcon,
  localizeString,
} from '@/data/store';
import type { CategorySeed } from '../../../../prisma/seed-data';

function diseasesInCategory(categorySlug: string, locale: Locale): DiseaseSummaryDTO[] {
  return getAllDiseases()
    .filter((d) => d.categorySlugs.includes(categorySlug))
    .map((d) => ({ slug: d.slug, name: localizeString(d.name, locale) }));
}

function toCategoryDto(category: CategorySeed, locale: Locale): CategoryDTO {
  return {
    slug: category.slug,
    name: localizeString(category.name, locale),
    icon: getCategoryIcon(category.slug),
    diseases: diseasesInCategory(category.slug, locale),
  };
}

export function findCategoryBySlug(slug: string, locale: Locale): CategoryDTO | undefined {
  const category = getCategory(slug);
  if (!category) return undefined;
  return toCategoryDto(category, locale);
}

export function findAllCategories(locale: Locale): CategoryDTO[] {
  return getAllCategories().map((category) => toCategoryDto(category, locale));
}