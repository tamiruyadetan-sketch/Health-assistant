import { Link } from 'react-router-dom';
import type { DiseaseSummaryDTO } from '@health-portal/shared-types';

interface DiseaseCardProps {
  disease: DiseaseSummaryDTO;
}

export default function DiseaseCard({ disease }: DiseaseCardProps) {
  return (
    <Link
      to={`/disease/${disease.slug}`}
      className="card flex items-center justify-between gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md dark:hover:border-primary-700"
    >
      <span className="text-sm font-medium text-gray-800 group-hover:text-primary-700 dark:text-gray-100">
        {disease.name}
      </span>
      <span aria-hidden="true" className="shrink-0 text-primary-600 dark:text-primary-400">
        →
      </span>
    </Link>
  );
}