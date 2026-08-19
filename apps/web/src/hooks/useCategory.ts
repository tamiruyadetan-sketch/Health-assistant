import { useQuery } from '@tanstack/react-query';
import type { CategoryDTO } from '@health-portal/shared-types';
import { ApiError, apiGet } from '@/lib/apiClient';
import { useLanguage } from '@/context/LanguageContext';

export function useCategory(slug: string) {
  const { lang } = useLanguage();

  return useQuery({
    queryKey: ['category', slug, lang],
    queryFn: ({ signal }) => apiGet<CategoryDTO>(`/categories/${slug}`, { lang }, signal),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });
}