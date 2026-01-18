import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Zap, Blocks, Smartphone, Monitor } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute right-6 top-6">
        <LocaleSwitcher />
      </div>
      <div className="flex h-screen flex-col items-center justify-center px-6">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="text-2xl font-bold text-primary-foreground">M</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">{t('home.title')}</h1>
        <p className="mb-8 text-center text-muted-foreground">{t('home.subtitle')}</p>

        <div className="w-full max-w-md space-y-3">
          <FeatureCard
            icon={<Zap className="h-5 w-5 text-secondary-foreground" />}
            title={t('home.features.turborepo.title')}
            description={t('home.features.turborepo.description')}
          />
          <FeatureCard
            icon={<Blocks className="h-5 w-5 text-secondary-foreground" />}
            title={t('home.features.sharedPackages.title')}
            description={t('home.features.sharedPackages.description')}
          />
          <FeatureCard
            icon={<Smartphone className="h-5 w-5 text-secondary-foreground" />}
            title={t('home.features.crossPlatform.title')}
            description={t('home.features.crossPlatform.description')}
          />
          <FeatureCard
            icon={<Monitor className="h-5 w-5 text-secondary-foreground" />}
            title={t('home.features.desktopApp.title')}
            description={t('home.features.desktopApp.description')}
          />
        </div>

        <Link to="/about" className="mt-8 text-sm text-muted-foreground transition-colors hover:text-foreground">
          {t('home.aboutLink')}
        </Link>
      </div>
    </main>
  );
}
