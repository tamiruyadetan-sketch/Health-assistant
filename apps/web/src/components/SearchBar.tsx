import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSearchDiseases } from '@/hooks/useSearchDiseases';
import Spinner from '@/components/Spinner';
import { cx } from '@/lib/utils';
import { SearchIcon as SearchIconSvg } from '@/components/icons';

export default function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: results, isFetching } = useSearchDiseases(debounced);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    setHighlighted(-1);
  }, [debounced]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const selectDisease = (slug: string) => {
    setQuery('');
    setDebounced('');
    setOpen(false);
    setHighlighted(-1);
    navigate(`/disease/${slug}`);
  };

  const items = results ?? [];
  const showPanel = open && debounced.trim().length >= 2;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length === 0) return;
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlighted >= 0 && items[highlighted]) {
        e.preventDefault();
        selectDisease(items[highlighted].slug);
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="relative">
        <SearchIconSvg className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-label={t('home.searchAria')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('home.searchPlaceholder')}
          autoComplete="off"
          className="w-full rounded-full border border-gray-300 bg-white py-3 pl-11 pr-11 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
        {isFetching && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
            <Spinner className="h-4 w-4" />
          </span>
        )}
      </div>

      {showPanel && (
        <ul
          id="search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-dropdown dark:border-gray-700 dark:bg-gray-800"
        >
          {isFetching && items.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</li>
          )}

          {!isFetching && items.length === 0 && (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">{t('home.searchEmpty')}</li>
          )}

          {items.map((item, index) => (
            <li key={item.slug} role="option" aria-selected={highlighted === index}>
              <button
                type="button"
                onClick={() => selectDisease(item.slug)}
                onMouseEnter={() => setHighlighted(index)}
                className={cx(
                  'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left',
                  highlighted === index
                    ? 'bg-primary-50 text-primary-700 dark:bg-gray-700 dark:text-primary-200'
                    : 'text-gray-800 dark:text-gray-100'
                )}
              >
                <span className="text-sm font-medium">{item.name}</span>
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{item.categoryName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!showPanel && debounced.trim().length < 2 && query.length > 0 && (
        <p className="mt-1.5 pl-4 text-xs text-gray-500 dark:text-gray-400">{t('home.searchHelp')}</p>
      )}
    </div>
  );
}