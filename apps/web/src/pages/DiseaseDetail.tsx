import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDisease } from '@/hooks/useDisease';
import { ApiError } from '@/lib/apiClient';
import { hasText } from '@/lib/utils';
import Seo from '@/components/Seo';
import Section from '@/components/Section';
import SymptomList from '@/components/SymptomList';
import FoodList from '@/components/FoodList';
import ChatWidget from '@/components/ChatWidget/ChatWidget';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import ErrorBanner from '@/components/ErrorBanner';
import { SkeletonSection } from '@/components/Skeleton';
import {
  AlertIcon,
  CheckIcon,
  InfoIcon,
  ShieldIcon,
  SparklesIcon,
  StethoscopeIcon,
  ThermometerIcon,
  XIcon,
} from '@/components/icons';

export default function DiseaseDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data, isLoading, isError, error, refetch } = useDisease(slug);

  if (isError && error instanceof ApiError && error.status === 404) {
    return (
      <>
        <Seo title={`${t('disease.notFoundTitle')} — Health Portal`} />
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
          <AlertIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h1 className="text-2xl font-bold">{t('disease.notFoundTitle')}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t('disease.notFoundMessage')}</p>
          <Link
            to="/"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {t('disease.backToCategories')}
          </Link>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorBanner error={error} onRetry={() => void refetch()} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
      </div>
    );
  }

  const disease = data;
  const primaryCategory = disease.categories[0];

  return (
    <>
      <Seo
        title={`${disease.name} — Health Portal`}
        description={
          hasText(disease.whatIsIt)
            ? disease.whatIsIt.slice(0, 160)
            : `${disease.name} — ${t('disease.contentUnavailable')}`
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-sm">
          <ol className="flex flex-wrap items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                {t('disease.breadcrumbHome')}
              </Link>
            </li>
            {primaryCategory && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    to={`/category/${primaryCategory.slug}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {primaryCategory.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">/</li>
            <li className="font-medium text-gray-900 dark:text-gray-100">{disease.name}</li>
          </ol>
        </nav>

        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-gray-50">
          {disease.name}
        </h1>

        {disease.categories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              {t('disease.inCategories')}:
            </span>
            {disease.categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        <DisclaimerBanner className="mb-6" />

        <div className="flex flex-col gap-5">
          {hasText(disease.whatIsIt) && (
            <Section id="what-is-it" title={t('disease.whatIsIt')} icon={<InfoIcon className="h-5 w-5" />}>
              <p>{disease.whatIsIt}</p>
            </Section>
          )}

          {hasText(disease.causes) && (
            <Section id="causes" title={t('disease.causes')} icon={<AlertIcon className="h-5 w-5" />}>
              <p>{disease.causes}</p>
            </Section>
          )}

          {hasText(disease.howAcquired) && (
            <Section id="how-acquired" title={t('disease.howAcquired')} icon={<ShieldIcon className="h-5 w-5" />}>
              <p>{disease.howAcquired}</p>
            </Section>
          )}

          {hasText(disease.prevention) && (
            <Section id="prevention" title={t('disease.prevention')} icon={<SparklesIcon className="h-5 w-5" />}>
              <p>{disease.prevention}</p>
            </Section>
          )}

          {disease.symptoms.length > 0 && (
            <Section id="symptoms" title={t('disease.symptoms')} icon={<ThermometerIcon className="h-5 w-5" />}>
              <SymptomList symptoms={disease.symptoms} />
            </Section>
          )}

          {disease.foodsRecommended.length > 0 && (
            <Section id="foods-recommended" title={t('disease.foodsRecommended')} icon={<CheckIcon className="h-5 w-5" />}>
              <FoodList items={disease.foodsRecommended} variant="recommended" />
            </Section>
          )}

          {disease.foodsToAvoid.length > 0 && (
            <Section id="foods-to-avoid" title={t('disease.foodsToAvoid')} icon={<XIcon className="h-5 w-5" />}>
              <FoodList items={disease.foodsToAvoid} variant="avoid" />
            </Section>
          )}

          {hasText(disease.whenToSeeDoctor) && (
            <Section id="when-to-see-doctor" title={t('disease.whenToSeeDoctor')} icon={<StethoscopeIcon className="h-5 w-5" />}>
              <p>{disease.whenToSeeDoctor}</p>
            </Section>
          )}

          {hasText(disease.whatIsIt) && <ChatWidget diseaseSlug={disease.slug} />}
        </div>
      </div>
    </>
  );
}