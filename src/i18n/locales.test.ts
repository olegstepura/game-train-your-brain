import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from './config';
import { translations, type TranslationKey } from './locales';

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('translations', () => {
  const reference = translations[DEFAULT_LANGUAGE];
  const keys = Object.keys(reference) as TranslationKey[];

  it.each(SUPPORTED_LANGUAGES.map((l) => l.code))(
    '%s uses the same placeholders as the default language',
    (code) => {
      for (const key of keys) {
        expect(placeholders(translations[code][key]), key).toEqual(
          placeholders(reference[key]),
        );
      }
    },
  );
});
