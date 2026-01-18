import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { locales, localeFlags, localeNames, type Locale } from '@repo/i18n';
import { Globe } from 'lucide-react';
import { changeLanguage, getCurrentLanguage } from '@/i18n';

export function LocaleSwitcher(): ReactNode {
  const { t } = useTranslation();
  const currentLocale = getCurrentLanguage();

  const handleChange = (newLocale: string) => {
    changeLanguage(newLocale as Locale);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        value={currentLocale}
        onChange={e => handleChange(e.target.value)}
        aria-label={t('localeSwitcher.label')}
      >
        {locales.map(locale => (
          <option key={locale} value={locale}>
            {localeFlags[locale]} {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
