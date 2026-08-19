import { useQuery } from '@tanstack/react-query';
import type { SearchResultDTO } from '@health-portal/shared-types';
import { apiGet } from '@/lib/apiClient';
import { useLanguage } from '@/context/LanguageContext';

export function useSearchDiseases(query: string) {
  const { lang } = useLanguage();
  const trimmed = query.trim();

  return useQuery({
    queryKey: ['search', trimmed, lang],
    queryFn: ({ signal }) => apiGet<SearchResultDTO[]>('/diseases', { search: trimmed, lang }, signal),
    enabled: trimmed.length >= 2,
    staleTime: 60 * 1000,
  });
}