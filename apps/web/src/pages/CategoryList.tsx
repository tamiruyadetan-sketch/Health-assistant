import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategory } from '@/hooks/useCategory';
import { ApiError } from '@/lib/apiClient';
import { categoryIcon } from '@/lib/categoryIcons';
import Seo from '@/components/Seo';
import DiseaseCard from '@/components/DiseaseCard';
import ErrorBanner from '@/components/ErrorBanner';
import { SkeletonCard } from '@/components/Skeleton';
import { AlertIcon } from '@/components/icons';

export default function CategoryList() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: category, isLoading, isError, error, refetch } = useCategory(slug);

  if (isError && error instanceof ApiError && error.status === 404) {
    return (
      <>
        <Seo title={`${t('category.notFoundTitle')} — Health Portal`} />
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
          <AlertIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h1 className="text-2xl font-bold">{t('category.notFoundTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('category.notFoundMessage')}</p>
          <Link
            to="/"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {t('category.backToCategories')}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title={category ? `${category.name} — Health Portal` : t('category.backToCategories')}
        description={
          category
            ? `${category.name} — ${t('category.diseasesCount', { count: category.diseases.length })}`
            : undefined
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <ol className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                {t('disease.breadcrumbHome')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-gray-900 dark:text-gray-100">{category?.name ?? ''}</li>
          </ol>
        </nav>

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && <ErrorBanner error={error} onRetry={() => void refetch()} />}

        {category && (
          <>
            <div className="mb-8 flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-3xl dark:bg-primary-900/30"
              >
                {categoryIcon(category.slug, category.icon)}
              </span>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 sm:text-3xl">
                  {category.name}
                </h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">
                  {t('category.diseasesCount', { count: category.diseases.length })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.diseases.map((disease) => (
                <DiseaseCard key={disease.slug} disease={disease} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}