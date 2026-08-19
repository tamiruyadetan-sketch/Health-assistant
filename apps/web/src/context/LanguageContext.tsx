import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Locale } from '@health-portal/shared-types';
import i18n from '@/i18n';

interface LanguageContextValue {
  lang: Locale;
  setLang: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('lang');
  return stored === 'om' ? 'om' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(getInitialLang);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    void i18n.changeLanguage(lang);
  }, [lang]);

  const setLang = useCallback((locale: Locale) => setLangState(locale), []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}