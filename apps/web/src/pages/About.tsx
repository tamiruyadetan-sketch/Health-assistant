import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from '@/components/Seo';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import { HeartIcon, InfoIcon, ShieldIcon, UsersIcon, MailIcon } from '@/components/icons';

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={`${t('about.title')} — Health Portal`} description={t('about.missionBody')} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <InfoIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-50">{t('about.title')}</h1>
        </div>

        <div className="flex flex-col gap-6">
          <section aria-labelledby="mission" className="card p-6">
            <h2 id="mission" className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <HeartIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              {t('about.missionTitle')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{t('about.missionBody')}</p>
          </section>

          <DisclaimerBanner />

          <section aria-labelledby="disclaimer-detail" className="card p-6">
            <h2 id="disclaimer-detail" className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <ShieldIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              {t('about.disclaimerTitle')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{t('about.disclaimerBody')}</p>
          </section>

          <section aria-labelledby="team" className="card p-6">
            <h2 id="team" className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <UsersIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              {t('about.teamTitle')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{t('about.teamBody')}</p>
          </section>

          <section aria-labelledby="contact" className="card p-6">
            <h2 id="contact" className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <MailIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              {t('about.contactTitle')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300">{t('about.contactBody')}</p>
          </section>

          <Link
            to="/"
            className="self-start rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            {t('about.backHome')}
          </Link>
        </div>
      </div>
    </>
  );
}