import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultLocale, locales, type Locale } from '@repo/i18n';

import ko from './locales/ko.json';
import en from './locales/en.json';
import ja from './locales/ja.json';

const resources = {
  ko: { translation: ko },
  en: { translation: en },
  ja: { translation: ja },
} as const;

const i18nInstance = createInstance();

i18nInstance.use(initReactI18next).init({
  resources,
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  supportedLngs: [...locales],
  interpolation: {
    escapeValue: false,
  },
});

export function changeLanguage(locale: Locale) {
  return i18nInstance.changeLanguage(locale);
}

export function getCurrentLanguage(): Locale {
  const lang = i18nInstance.language as Locale | undefined;
  return lang ?? defaultLocale;
}

export default i18nInstance;
