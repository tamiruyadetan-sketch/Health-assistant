import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CategoryDTO } from '@health-portal/shared-types';
import { ChevronDownIcon } from '@/components/icons';
import { categoryIcon } from '@/lib/categoryIcons';
import { cx } from '@/lib/utils';

interface MobileNavProps {
  categories?: CategoryDTO[];
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ categories, open, onClose }: MobileNavProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (slug: string) => setExpanded((prev) => (prev === slug ? null : slug));

  return (
    <div
      className={cx(
        'overflow-hidden border-t border-gray-200 bg-white transition-[max-height] duration-200 dark:border-gray-800 dark:bg-gray-900 md:hidden',
        open ? 'max-h-[calc(100vh-4rem)] overflow-y-auto' : 'max-h-0 border-t-0'
      )}
    >
      <nav aria-label="Mobile navigation" className="px-4 py-3">
        <Link
          to="/"
          onClick={onClose}
          className="block rounded-md px-2 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {t('nav.home')}
        </Link>

        {categories?.map((category) => {
          const isExpanded = expanded === category.slug;
          return (
            <div key={category.slug} className="border-b border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => toggle(category.slug)}
                aria-expanded={isExpanded}
                className="flex w-full items-center justify-between rounded-md px-2 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-base">
                    {categoryIcon(category.slug, category.icon)}
                  </span>
                  {category.name}
                </span>
                <ChevronDownIcon
                  className={cx('h-4 w-4 text-gray-400 transition-transform', isExpanded && 'rotate-180')}
                />
              </button>

              <div className={cx('overflow-hidden', isExpanded ? 'block' : 'hidden')}>
                <ul className="mb-1 ml-3 border-l border-gray-200 pl-3 dark:border-gray-700">
                  {category.diseases.map((disease) => (
                    <li key={disease.slug}>
                      <Link
                        to={`/disease/${disease.slug}`}
                        onClick={onClose}
                        className="block rounded-md px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-primary-300"
                      >
                        {disease.name}
                      </Link>
                    </li>
                  ))}
                  {category.diseases.length === 0 && (
                    <li className="px-2 py-2 text-sm text-gray-500 dark:text-gray-400">{t('nav.noDiseases')}</li>
                  )}
                </ul>
                <Link
                  to={`/category/${category.slug}`}
                  onClick={onClose}
                  className="ml-3 inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-primary-600 hover:bg-primary-50 dark:text-primary-300 dark:hover:bg-gray-800"
                >
                  {t('nav.viewAll')}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}