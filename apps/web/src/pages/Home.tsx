import { useTranslation } from 'react-i18next';
import { useCategories } from '@/hooks/useCategories';
import SearchBar from '@/components/SearchBar';
import CategoryCard from '@/components/CategoryCard';
import Seo from '@/components/Seo';
import ErrorBanner from '@/components/ErrorBanner';
import { SkeletonCard } from '@/components/Skeleton';
import { HeartIcon } from '@/components/icons';

export default function Home() {
  const { t } = useTranslation();
  const { data: categories, isLoading, isError, error, refetch } = useCategories();

  return (
    <>
      <Seo
        title={t('home.heroTitle')}
        description={t('home.heroSubtitle')}
      />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-primary-50 to-gray-50 dark:border-gray-800 dark:from-primary-950/40 dark:to-gray-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
            <HeartIcon className="h-7 w-7" />
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
            {t('home.heroTitle')}
          </h1>
          <p className="max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            {t('home.heroSubtitle')}
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('home.categoriesTitle')}</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{t('home.categoriesSubtitle')}</p>
        </div>

        {isError && (
          <ErrorBanner error={error} onRetry={() => void refetch()} className="mb-6" />
        )}

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {categories && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}