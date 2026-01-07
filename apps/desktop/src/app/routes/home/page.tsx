import { Link } from 'react-router';
import { Zap, Blocks, Smartphone, Monitor } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen flex-col items-center justify-center px-6">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
          <span className="text-2xl font-bold text-primary-foreground">M</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">Turborepo Monorepo</h1>
        <p className="mb-8 text-center text-muted-foreground">Next.js · NestJS · Expo · Electron</p>

        <div className="w-full max-w-md space-y-3">
          <FeatureCard
            icon={<Zap className="h-5 w-5 text-secondary-foreground" />}
            title="Turborepo"
            description="고속 빌드 시스템과 캐싱으로 개발 속도 향상"
          />
          <FeatureCard
            icon={<Blocks className="h-5 w-5 text-secondary-foreground" />}
            title="Shared Packages"
            description="UI, 타입, 설정을 패키지로 공유하여 일관성 유지"
          />
          <FeatureCard
            icon={<Smartphone className="h-5 w-5 text-secondary-foreground" />}
            title="Cross Platform"
            description="Web, Mobile, Desktop 모든 플랫폼 지원"
          />
          <FeatureCard
            icon={<Monitor className="h-5 w-5 text-secondary-foreground" />}
            title="Desktop App"
            description="Electron으로 구동되는 네이티브 데스크톱 앱"
          />
        </div>

        <Link to="/about" className="mt-8 text-sm text-muted-foreground transition-colors hover:text-foreground">
          About →
        </Link>
      </div>
    </main>
  );
}
