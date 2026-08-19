import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';

interface SectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, title, icon, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cx('card p-5 sm:p-6', className)}
    >
      <h2
        id={`${id}-title`}
        className="mb-3 flex items-center gap-2.5 text-lg font-semibold text-gray-900 dark:text-gray-100"
      >
        {icon && <span aria-hidden="true" className="text-primary-600 dark:text-primary-400">{icon}</span>}
        {title}
      </h2>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  );
}