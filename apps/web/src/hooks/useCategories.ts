import { useQuery } from '@tanstack/react-query';
import type { CategoryDTO } from '@health-portal/shared-types';
import { apiGet } from '@/lib/apiClient';
import { useLanguage } from '@/context/LanguageContext';

export function useCategories() {
  const { lang } = useLanguage();

  return useQuery({
    queryKey: ['categories', lang],
    queryFn: ({ signal }) => apiGet<CategoryDTO[]>('/categories', { lang }, signal),
    staleTime: 5 * 60 * 1000,
  });
}