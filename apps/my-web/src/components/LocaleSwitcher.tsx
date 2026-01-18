'use client';

import type { ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useTransition } from 'react';
import { locales, localeFlags, type Locale } from '@repo/i18n';
import { Globe } from 'lucide-react';

export default function LocaleSwitcher(): ReactNode {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LocaleSwitcher');
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        value={locale}
        disabled={isPending}
        onChange={e => handleChange(e.target.value)}
        aria-label={t('label')}
      >
        {locales.map(loc => (
          <option key={loc} value={loc}>
            {localeFlags[loc]} {t(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}
