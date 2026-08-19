import { asyncHandler } from '@/lib/asyncHandler';
import { parseLocaleQuery, parseSearchQuery, parseSlugParam } from '@/middleware/validate';
import { getDiseaseBySlug, search } from '@/services/diseaseService';

export const getDiseaseBySlugHandler = asyncHandler(async (req, res) => {
  const lang = parseLocaleQuery(req.query);
  const slug = parseSlugParam(req.params.slug);
  res.status(200).json(getDiseaseBySlug(slug, lang));
});

export const searchDiseasesHandler = asyncHandler(async (req, res) => {
  const query = parseSearchQuery(req.query);
  res.status(200).json(search(query.search ?? '', query.lang));
});