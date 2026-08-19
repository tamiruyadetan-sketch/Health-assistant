import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CategoryDTO } from '@health-portal/shared-types';
import { ChevronDownIcon } from '@/components/icons';
import { cx } from '@/lib/utils';

const CLOSE_DELAY_MS = 150;

interface NavItemProps {
  category: CategoryDTO;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNavigate: () => void;
  triggerRef: (el: HTMLButtonElement | null) => void;
}

export default function NavItem({ category, open, onOpen, onClose, onNavigate, triggerRef }: NavItemProps) {
  const { t } = useTranslation();
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearTimer();
    onOpen();
  };

  const handleMouseLeave = () => {
    clearTimer();
    timerRef.current = window.setTimeout(onClose, CLOSE_DELAY_MS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) onClose();
      else onOpen();
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown' && !open) {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onKeyDown={handleKeyDown}
        className={cx(
          'inline-flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
          open
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-100'
        )}
      >
        {category.name}
        <ChevronDownIcon className={cx('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-gray-200 bg-white p-2 shadow-dropdown dark:border-gray-700 dark:bg-gray-800">
          <ul className="dropdown-scroll max-h-80 overflow-y-auto">
            {category.diseases.map((disease) => (
              <li key={disease.slug}>
                <Link
                  to={`/disease/${disease.slug}`}
                  onClick={onNavigate}
                  className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-primary-300"
                >
                  {disease.name}
                </Link>
              </li>
            ))}
            {category.diseases.length === 0 && (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{t('nav.noDiseases')}</li>
            )}
          </ul>
          <Link
            to={`/category/${category.slug}`}
            onClick={onNavigate}
            className="mt-1 flex items-center justify-between rounded-md border-t border-gray-100 px-3 py-2 text-xs font-semibold text-primary-600 hover:bg-primary-50 dark:border-gray-700 dark:text-primary-300 dark:hover:bg-gray-700"
          >
            {t('nav.viewAll')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </li>
  );
}