import { Link } from 'react-router';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen flex-col items-center justify-center px-6">
        <h1 className="mb-4 text-2xl font-bold">About</h1>
        <p className="mb-6 max-w-md text-center text-muted-foreground">
          이 데스크톱 앱은 Turborepo 모노레포 템플릿의 일부입니다. Electron + React + Tailwind CSS + HashRouter로
          구성되어 있습니다.
        </p>
        <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
          ← Home
        </Link>
      </div>
    </main>
  );
}
