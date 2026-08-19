import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/Seo';
import { AlertIcon } from '@/components/icons';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={`404 — ${t('common.notFound')}`} />
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-4 py-24 text-center">
        <p className="text-6xl font-black text-primary-200 dark:text-primary-900">404</p>
        <AlertIcon className="h-10 w-10 text-gray-300 dark:text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t('common.notFound')}</h1>
        <Link
          to="/"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          {t('common.backHome')}
        </Link>
      </div>
    </>
  );
}