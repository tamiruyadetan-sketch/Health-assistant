import { useTranslation } from 'react-i18next';
import { ApiError } from '@/lib/apiClient';
import { AlertIcon, RefreshIcon } from '@/components/icons';
import { cx } from '@/lib/utils';

interface ErrorBannerProps {
  error?: unknown;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorBanner({ error, onRetry, className }: ErrorBannerProps) {
  const { t } = useTranslation();
  const isNetwork = error instanceof ApiError && error.status === 0;
  const message = isNetwork ? t('errors.network') : t('errors.generic');

  return (
    <div
      role="alert"
      className={cx(
        'flex flex-col items-start gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <AlertIcon className="h-5 w-5" />
        <span className="font-medium">{message}</span>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-sm font-semibold text-red-800 transition-colors hover:bg-red-200 dark:bg-red-900/60 dark:text-red-100 dark:hover:bg-red-900"
        >
          <RefreshIcon className="h-4 w-4" />
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}