import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { GlobeIcon, InfoIcon, MoonIcon, SunIcon } from '@/components/icons';

export default function UtilityBar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={t('utility.brightness')}
        title={t('utility.brightness')}
        className="icon-btn"
      >
        {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>

      <Link
        to="/about"
        aria-label={t('nav.about')}
        title={t('nav.about')}
        className="icon-btn"
      >
        <InfoIcon className="h-5 w-5" />
      </Link>

      <button
        type="button"
        onClick={() => setLang(lang === 'en' ? 'om' : 'en')}
        aria-label={t('utility.chooseLanguage')}
        title={t('utility.chooseLanguage')}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        <GlobeIcon className="h-4 w-4" />
        <span className="uppercase">{lang === 'en' ? 'EN' : 'OM'}</span>
      </button>
    </div>
  );
}