export const locales = ['ko', 'en'] as const;

export const defaultLocale = 'ko' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
};

export function isValidLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.some(locale => locale === value);
}
