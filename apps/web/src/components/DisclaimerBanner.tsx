import { useTranslation } from 'react-i18next';
import { ShieldIcon } from '@/components/icons';
import { cx } from '@/lib/utils';

interface DisclaimerBannerProps {
  className?: string;
  compact?: boolean;
}

export default function DisclaimerBanner({ className, compact }: DisclaimerBannerProps) {
  const { t } = useTranslation();

  return (
    <div
      role="note"
      className={cx(
        'flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200',
        compact && 'p-2.5 text-sm',
        className
      )}
    >
      <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{t(compact ? 'chat.disclaimer' : 'common.disclaimer')}</p>
    </div>
  );
}