import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeartIcon } from '@/components/icons';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <HeartIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-semibold">{t('footer.about')}</span>
          </div>
          <nav aria-label="Footer" className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              {t('nav.home')}
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              {t('nav.about')}
            </Link>
          </nav>
        </div>
        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}