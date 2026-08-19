import { useQuery } from '@tanstack/react-query';
import type { DiseaseDetailDTO } from '@health-portal/shared-types';
import { ApiError, apiGet } from '@/lib/apiClient';
import { useLanguage } from '@/context/LanguageContext';

export function useDisease(slug: string) {
  const { lang } = useLanguage();

  return useQuery({
    queryKey: ['disease', slug, lang],
    queryFn: ({ signal }) => apiGet<DiseaseDetailDTO>(`/diseases/${slug}`, { lang }, signal),
    enabled: Boolean(slug),
    retry: (failureCount, error) => {
      if (error instanceof ApiError && error.status === 404) return false;
      return failureCount < 2;
    },
  });
}