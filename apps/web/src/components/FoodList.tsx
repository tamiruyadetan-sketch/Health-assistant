import { cx } from '@/lib/utils';

interface FoodListProps {
  items: string[];
  variant: 'recommended' | 'avoid';
}

export default function FoodList({ items, variant }: FoodListProps) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className={cx(
              'mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white',
              variant === 'recommended' ? 'bg-green-600' : 'bg-red-600'
            )}
          >
            {variant === 'recommended' ? '✓' : '✕'}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}