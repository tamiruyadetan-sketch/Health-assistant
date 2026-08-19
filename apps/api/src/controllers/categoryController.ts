import { asyncHandler } from '@/lib/asyncHandler';
import { parseLocaleQuery, parseSlugParam } from '@/middleware/validate';
import { getCategories, getCategoryBySlug } from '@/services/categoryService';

export const getCategoriesHandler = asyncHandler(async (req, res) => {
  const lang = parseLocaleQuery(req.query);
  res.status(200).json(getCategories(lang));
});

export const getCategoryBySlugHandler = asyncHandler(async (req, res) => {
  const lang = parseLocaleQuery(req.query);
  const slug = parseSlugParam(req.params.slug);
  res.status(200).json(getCategoryBySlug(slug, lang));
});