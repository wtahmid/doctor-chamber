// i18n context + hook.
//
// The active locale is stored in React state (no cookies/Server Components
// routing yet — we do a client-side language switch). Changing language
// re-renders any component that calls `useTranslate()` and reads the
// translated string from the matching file in src/messages/.

"use client";

import React from 'react';
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Locale, TranslationMessages } from './types';
import { DEFAULT_LOCALE, translationMessages } from './../messages/en';

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof TranslationMessages | string, vars?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Build a nested object from a dot-separated key like "hero.welcome".
 * Falls back to the raw key string if no translation matches.
 */
function getByPath(obj: unknown, path: string): string {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return path;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  const setLocale = useCallback((l: Locale) => {
    if (!DEFAULT_LOCALE?.includes(l as Locale)) return;
    setLocaleState(l);
  }, []);

  const t = useCallback(
    (key: keyof TranslationMessages | string, vars: Record<string, string> = {}) => {
      const rawKey = typeof key === 'string' ? key : key as string;
      // Resolve the leaf node: translationMessages[en]['hero']['welcome']
      const leaf = getByPath(translationMessages.en, rawKey);
      let text = typeof leaf === 'string' ? leaf : rawKey;

      // Simple placeholder substitution, e.g. {year}, {date}
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(new RegExp('{', 'g'), v);
      }
      return text;
    },
    []
  );

  const contextValue = { locale, setLocale, t };
  const Provider = I18nContext.Provider;
  return React.createElement(Provider, { value: contextValue }, children);
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <I18nProvider>');
  return ctx;
}
