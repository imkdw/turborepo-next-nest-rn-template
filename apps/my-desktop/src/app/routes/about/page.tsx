import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen flex-col items-center justify-center px-6">
        <h1 className="mb-4 text-2xl font-bold">{t('about.title')}</h1>
        <p className="mb-6 max-w-md text-center text-muted-foreground">{t('about.description')}</p>
        <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          {t('about.homeLink')}
        </Link>
      </div>
    </main>
  );
}
