# CLAUDE.md - Web (Next.js)

> **IMPORTANT**: 이 파일은 Web 앱의 구조나 패턴이 변경될 때 반드시 함께 업데이트해야 합니다.

## Quick Reference

| Item      | Value                   |
| --------- | ----------------------- |
| Framework | Next.js 16 (App Router) |
| React     | 19                      |
| Bundler   | Turbopack               |
| i18n      | next-intl 4.7           |
| Styling   | Tailwind CSS            |
| Port      | 3000                    |

## Commands

```bash
# Development
pnpm dev                    # Start with Turbopack (--hostname 0.0.0.0)
pnpm build                  # Production build
pnpm start                  # Start production server

# Code Quality
pnpm lint                   # ESLint with auto-fix
pnpm check-types            # TypeScript type check
```

## Project Structure

```
src/
  app/
    [locale]/               # i18n dynamic segment
      layout.tsx            # Locale layout (NextIntlClientProvider)
      page.tsx              # Home page
      [...other pages]
    globals.css             # Global styles
  components/               # React components
  i18n/
    navigation.ts           # Localized navigation helpers
    request.ts              # Server-side locale request
    routing.ts              # Routing configuration
  messages/                 # Translation files
    en.json
    ko.json
    ja.json (if added)
  proxy.ts                  # i18n proxy (Next.js 16+, formerly middleware.ts)

next.config.ts              # Next.js + next-intl config
tailwind.config.ts          # Tailwind configuration
```

## i18n Architecture (next-intl)

### Routing Setup

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from '@repo/i18n';

export const routing = defineRouting({
  locales, // ['en', 'ko']
  defaultLocale, // 'en'
  localePrefix: 'as-needed', // Hide default locale from URL
});
```

### Proxy (Next.js 16+)

```typescript
// src/proxy.ts (formerly middleware.ts)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

### Server Component Usage

```typescript
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Content />;
}

function Content() {
  const t = useTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

### Static Generation

```typescript
// Required for static export with i18n
export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}
```

## Code Patterns

### Page Component Pattern

```typescript
// src/app/[locale]/page.tsx
import { isValidLocale } from '@repo/i18n';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  return <Content />;
}
```

### Layout Pattern

```typescript
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Styling with Tailwind

```typescript
import { cn } from '@repo/ui';

<div className={cn('bg-background', isActive && 'bg-primary')} />
```

## Code Style Rules

- Path alias: `@/` → `src/` (e.g., `@/components/Button`)
- NEVER use `as any`, `@ts-ignore`, `@ts-expect-error`
- Use `lucide-react` for icons
- Import shared components from `@repo/ui`
- Use `cn()` from `@repo/ui` for class merging

## Shared Packages Usage

```typescript
import { cn } from '@repo/ui'; // Tailwind class merger
import { locales, defaultLocale } from '@repo/i18n'; // i18n config
import { APP_ENV } from '@repo/consts'; // Constants
```

## Adding New Features

### New Page

1. `src/app/[locale]/` 아래에 폴더/파일 생성
2. `generateStaticParams()` 추가 (static export 시)
3. `setRequestLocale()` 호출

### New Translation Keys

1. `src/messages/en.json`, `ko.json`에 키 추가
2. `useTranslations('Namespace')` 로 사용

### New Component

1. `src/components/` 에 생성
2. 공유 컴포넌트는 `packages/ui/` 에 추가

## Turbopack Notes

- `next dev --turbopack` 사용 중
- Webpack 대비 빠른 HMR
- 일부 Webpack 플러그인 미지원 가능

## Mobile WebView Integration

이 웹 앱은 Mobile 앱의 WebView에서도 실행됩니다:

- `--hostname 0.0.0.0`: 모바일 디바이스에서 접근 가능
- Android 에뮬레이터: `10.0.2.2:3000`
- iOS 시뮬레이터: `localhost:3000`

## Common Issues

- **Hydration 오류**: Server/Client 컴포넌트 경계 확인
- **i18n 라우팅 오류**: `proxy.ts` matcher 확인
- **번역 누락**: `messages/*.json` 키 일치 확인
- **Turbopack 오류**: `pnpm dev` (Turbopack 없이) 시도
