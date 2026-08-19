import type { CategorySummaryDTO, DiseaseDetailDTO, Locale, SearchResultDTO } from '@health-portal/shared-types';
import { getCategory, getDisease, getAllDiseases, localizeList, localizeString } from '@/data/store';
import type { DiseaseSeed } from '../../../../prisma/seed-data';

const SEARCH_RESULT_LIMIT = 10;

function categoriesForDisease(disease: DiseaseSeed, locale: Locale): CategorySummaryDTO[] {
  return disease.categorySlugs
    .map((slug) => getCategory(slug))
    .filter((category) => category !== undefined)
    .map((category) => ({ slug: category.slug, name: localizeString(category.name, locale) }));
}

export function findDiseaseBySlug(slug: string, locale: Locale): DiseaseDetailDTO | undefined {
  const disease = getDisease(slug);
  if (!disease) return undefined;

  return {
    slug: disease.slug,
    name: localizeString(disease.name, locale),
    categories: categoriesForDisease(disease, locale),
    whatIsIt: localizeString(disease.whatIsIt, locale),
    causes: localizeString(disease.causes, locale),
    howAcquired: localizeString(disease.howAcquired, locale),
    prevention: localizeString(disease.prevention, locale),
    symptoms: localizeList(disease.symptoms, locale),
    foodsRecommended: localizeList(disease.foodsRecommended, locale),
    foodsToAvoid: localizeList(disease.foodsToAvoid, locale),
    whenToSeeDoctor: null,
  };
}

export function searchDiseases(query: string, locale: Locale): SearchResultDTO[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const results: SearchResultDTO[] = [];
  for (const disease of getAllDiseases()) {
    if (results.length >= SEARCH_RESULT_LIMIT) break;
    const name = localizeString(disease.name, locale);
    if (!name.toLowerCase().includes(normalized)) continue;

    const primaryCategory = disease.categorySlugs.map((slug) => getCategory(slug)).find((c) => c !== undefined);
    results.push({
      slug: disease.slug,
      name,
      categorySlug: primaryCategory?.slug ?? '',
      categoryName: primaryCategory ? localizeString(primaryCategory.name, locale) : '',
    });
  }

  return results;
}