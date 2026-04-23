import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  type LanguageCode,
} from './config';
import { translations, type TranslationKey } from './locales';

const STORAGE_KEY = 'tyb.lang';

export type Translator = (
  key: TranslationKey,
  params?: Record<string, string | number>,
) => string;

interface I18nValue {
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  t: Translator;
}

const I18nContext = createContext<I18nValue | null>(null);

const detectFromBrowser = (): LanguageCode => {
  const candidates = [
    ...(navigator.languages ?? []),
    navigator.language,
  ].filter(Boolean);
  for (const candidate of candidates) {
    const code = candidate.slice(0, 2).toLowerCase();
    if (isSupportedLanguage(code)) return code;
  }
  return DEFAULT_LANGUAGE;
};

const readStored = (): LanguageCode | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && isSupportedLanguage(v) ? v : null;
  } catch {
    return null;
  }
};

const initialLang: LanguageCode = readStored() ?? detectFromBrowser();

const interpolate = (
  template: string,
  params?: Record<string, string | number>,
): string => {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    Object.prototype.hasOwnProperty.call(params, key)
      ? String(params[key])
      : `{${key}}`,
  );
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<LanguageCode>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((next: LanguageCode) => setLangState(next), []);

  const value = useMemo<I18nValue>(() => {
    const dict = translations[lang];
    const fallback = translations[DEFAULT_LANGUAGE];
    const t: Translator = (key, params) =>
      interpolate(dict[key] ?? fallback[key] ?? key, params);
    return { lang, setLang, t };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
};
