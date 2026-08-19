const CATEGORY_ICONS: Record<string, string> = {
  'skin-diseases': '🩹',
  'blood-diseases': '🩸',
  'heart-cardiovascular-diseases': '❤️',
  'respiratory-diseases': '🫁',
  'neurological-diseases': '🧠',
  'digestive-system-diseases': '🍽️',
  'musculoskeletal-diseases': '🦴',
  'infectious-diseases': '🦠',
  'endocrine-metabolic-diseases': '🧪',
  'kidney-urinary-diseases': '💧',
  'eye-diseases': '👁️',
  'ear-nose-throat-diseases': '👂',
};

const DEFAULT_ICON = '🩺';

export function categoryIcon(slug: string, icon?: string | null): string {
  if (icon) return icon;
  return CATEGORY_ICONS[slug] ?? DEFAULT_ICON;
}