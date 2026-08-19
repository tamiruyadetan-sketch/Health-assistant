import { useTranslation } from 'react-i18next';
import Spinner from '@/components/Spinner';

export default function PageLoader() {
  const { t } = useTranslation();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400"
    >
      <Spinner className="h-8 w-8" />
      <span className="text-sm">{t('common.loading')}</span>
    </div>
  );
}