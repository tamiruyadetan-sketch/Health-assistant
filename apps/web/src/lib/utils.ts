export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function hasText(value?: string | null): boolean {
  return Boolean(value && value.trim().length > 0);
}