# CLAUDE.md - Desktop (Electron)

> **IMPORTANT**: 이 파일은 Desktop 앱의 구조나 패턴이 변경될 때 반드시 함께 업데이트해야 합니다.

## Quick Reference

| Item         | Value                     |
| ------------ | ------------------------- |
| Framework    | Electron 39               |
| Build Tool   | electron-forge + Webpack  |
| UI Framework | React 19 + React Router 7 |
| Styling      | Tailwind CSS              |
| i18n         | i18next + react-i18next   |

## Commands

```bash
# Development
pnpm dev                    # Start development mode
pnpm start                  # Same as dev

# Build & Package
pnpm package                # Package app (not distributable)
pnpm make                   # Create distributable installer
pnpm publish                # Publish to configured targets

# Code Quality
pnpm lint                   # ESLint
```

## Project Structure

```
src/
  index.ts                  # Main process entry (Electron)
  preload.ts                # Preload script (IPC bridge)
  renderer.tsx              # Renderer process entry (React)
  index.html                # HTML template
  index.css                 # Global styles (Tailwind)
  app/
    App.tsx                 # Root React component
    router.tsx              # React Router configuration
    routes/                 # Route components
  components/               # Reusable components
  i18n/
    index.ts                # i18next configuration
    locales/                # Translation files (en, ko, ja)
  lib/
    utils.ts                # Utility functions

# Configuration
forge.config.ts             # Electron Forge config
webpack.main.config.ts      # Webpack config for main process
webpack.renderer.config.ts  # Webpack config for renderer
webpack.plugins.ts          # Shared Webpack plugins
webpack.rules.ts            # Shared Webpack rules
tailwind.config.ts          # Tailwind configuration
```

## Electron Architecture

### Main Process (`src/index.ts`)

- Node.js 환경에서 실행
- BrowserWindow 생성 및 관리
- 시스템 API 접근 (파일, 메뉴 등)

### Renderer Process (`src/renderer.tsx`)

- 브라우저 환경 (React 앱)
- UI 렌더링
- Main process와 IPC 통신

### Preload Script (`src/preload.ts`)

- Main ↔ Renderer 간 안전한 IPC 브릿지
- `contextBridge`로 API 노출

## Code Patterns

### React Router Setup

```typescript
// router.tsx
import { createHashRouter } from 'react-router';

export const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
]);
```

- Electron에서는 `HashRouter` 사용 (file:// protocol 호환)

### i18n Usage

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

### Shared Packages

```typescript
import { cn } from '@repo/ui'; // Utility functions
import { locales } from '@repo/i18n'; // i18n config
```

## Code Style Rules

- Path alias 없음 - 상대 경로 사용
- NEVER use `as any`, `@ts-ignore`, `@ts-expect-error`
- Use `lucide-react` for icons
- Tailwind CSS for all styling

## Electron Forge Configuration

### Makers (Installers)

- **Windows**: Squirrel (`.exe`)
- **macOS**: ZIP (`.zip`)
- **Linux**: DEB, RPM

### Security Fuses

```typescript
// forge.config.ts
[FuseV1Options.RunAsNode]: false,
[FuseV1Options.EnableCookieEncryption]: true,
[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
```

## Adding New Features

### New Route

1. `src/app/routes/`에 컴포넌트 생성
2. `src/app/router.tsx`에 라우트 추가

### New Translation

1. `src/i18n/locales/en.json`, `ko.json`, `ja.json`에 키 추가
2. `useTranslation()` 훅으로 사용

### IPC Communication

1. `preload.ts`에 API 정의
2. `index.ts`에 핸들러 등록
3. Renderer에서 `window.api.xxx()` 호출

## Common Issues

- **Electron 설치 실패**: `node node_modules/.pnpm/electron@*/node_modules/electron/install.js` 실행
- **DevTools 열림**: 개발 모드에서는 자동으로 열림 (`mainWindow.webContents.openDevTools()`)
- **White screen**: Webpack 빌드 오류 확인, 콘솔 에러 확인

## Build Notes

- 프로덕션 빌드 전 `pnpm package`로 먼저 테스트
- 코드 사이닝은 별도 설정 필요 (macOS notarization, Windows signing)
- 자동 업데이트는 `electron-updater` 별도 설정 필요
