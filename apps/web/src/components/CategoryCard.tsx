import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CategoryDTO } from '@health-portal/shared-types';
import { categoryIcon } from '@/lib/categoryIcons';

interface CategoryCardProps {
  category: CategoryDTO;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/category/${category.slug}`}
      className="card group flex flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-2xl dark:bg-primary-900/30"
        >
          {categoryIcon(category.slug, category.icon)}
        </span>
        <h2 className="text-base font-semibold text-gray-900 group-hover:text-primary-700 dark:text-gray-100 dark:group-hover:text-primary-300">
          {category.name}
        </h2>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('category.diseasesCount', { count: category.diseases.length })}
      </p>

      <span
        aria-hidden="true"
        className="text-sm font-semibold text-primary-600 transition-transform group-hover:translate-x-1 dark:text-primary-400"
      >
        →
      </span>
    </Link>
  );
}