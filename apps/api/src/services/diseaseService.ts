import type { DiseaseDetailDTO, Locale, SearchResultDTO } from '@health-portal/shared-types';
import { findDiseaseBySlug, searchDiseases } from '@/repositories/diseaseRepository';
import { notFoundError } from '@/lib/errors';

export function getDiseaseBySlug(slug: string, locale: Locale): DiseaseDetailDTO {
  const disease = findDiseaseBySlug(slug, locale);
  if (!disease) {
    throw notFoundError('DISEASE_NOT_FOUND', `No disease with slug "${slug}".`);
  }
  return disease;
}

export function search(query: string, locale: Locale): SearchResultDTO[] {
  return searchDiseases(query, locale);
}