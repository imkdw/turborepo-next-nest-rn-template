import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Zap, Blocks, Smartphone } from 'lucide-react';
import { isValidLocale } from '@repo/i18n';
import { notFound } from 'next/navigation';
import LocaleSwitcher from '@/components/LocaleSwitcher';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: PageProps): Promise<ReactNode> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent(): ReactNode {
  const t = useTranslations('HomePage');

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="px-5 pb-8 pt-12 md:px-8 md:pb-16 md:pt-20">
        <section className="mx-auto max-w-md md:max-w-2xl">
          <div className="mb-4 flex justify-end">
            <LocaleSwitcher />
          </div>

          <div className="mb-6 flex justify-center md:mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg md:h-20 md:w-20">
              <span className="text-2xl font-bold text-primary-foreground md:text-3xl">M</span>
            </div>
          </div>

          <div className="mb-10 text-center md:mb-14">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:mb-4 md:text-5xl">{t('title')}</h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{t('subtitle')}</p>
          </div>

          <div className="mb-10 space-y-3 md:mb-14 md:space-y-4">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary md:h-12 md:w-12">
                  <Zap className="h-5 w-5 text-secondary-foreground md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-card-foreground">{t('features.speed.title')}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t('features.speed.description')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary md:h-12 md:w-12">
                  <Blocks className="h-5 w-5 text-secondary-foreground md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-card-foreground">{t('features.sharing.title')}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t('features.sharing.description')}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary md:h-12 md:w-12">
                  <Smartphone className="h-5 w-5 text-secondary-foreground md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 font-semibold text-card-foreground">{t('features.crossPlatform.title')}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t('features.crossPlatform.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-5 text-center md:p-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary md:text-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t('webviewTest.badge')}
            </div>
            <h2 className="mb-2 text-lg font-semibold text-foreground md:text-xl">{t('webviewTest.title')}</h2>
            <p className="text-sm text-muted-foreground md:text-base">{t('webviewTest.description')}</p>
          </div>

          <footer className="mt-10 text-center md:mt-14">
            <p className="text-xs text-muted-foreground md:text-sm">{t('footer')}</p>
          </footer>
        </section>
      </div>
    </main>
  );
}
