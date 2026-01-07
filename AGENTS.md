# CLAUDE.md

This is a Turborepo monorepo with Next.js web frontend, NestJS backend API, Expo React Native mobile app, and Electron desktop app.

## Quick Reference

| App     | Location       | Port     | Run                |
| ------- | -------------- | -------- | ------------------ |
| API     | `apps/api`     | 8000     | `pnpm dev`         |
| Web     | `apps/web`     | 3000     | `pnpm dev`         |
| Mobile  | `apps/mobile`  | -        | `pnpm dev:mobile`  |
| Desktop | `apps/desktop` | -        | `pnpm dev:desktop` |
| Swagger | -              | 8000/api | Auto with API      |

## Commands

```bash
# Development
pnpm dev                    # Start API + Web (not mobile/desktop)
pnpm dev:mobile             # Start mobile app separately
pnpm dev:desktop            # Start desktop app separately
pnpm build                  # Build all packages
pnpm lint                   # Lint with auto-fix
pnpm check-types            # TypeScript type check
pnpm test                   # Run all tests
pnpm format                 # Prettier format all files

# Database
pnpm setup:local            # Start PostgreSQL + push Prisma schema
pnpm api prisma studio      # Open Prisma Studio
pnpm api prisma generate    # Generate Prisma client
pnpm api prisma db push     # Push schema changes

# Package-specific (use pnpm <package> <command>)
pnpm api test:unit          # API unit tests
pnpm api test:integration   # API integration tests
pnpm api test:e2e           # API e2e tests
pnpm web build              # Build web only
```

## Project Structure

```
apps/
  api/                      # NestJS 11 backend
    src/
      modules/              # Feature modules (use-case pattern)
      infra/                # Infrastructure (database, etc.)
    prisma/schema/          # Prisma schema files
    test/                   # unit/, integration/, e2e/
  web/                      # Next.js 16 frontend (App Router)
    src/
      app/[locale]/         # i18n routes with next-intl
      components/           # React components
      i18n/                 # Internationalization config
      messages/             # en.json, ko.json
  mobile/                   # Expo 54 mobile app
  desktop/                  # Electron desktop app (electron-forge)

packages/
  ui/                       # Shared React components (CVA + Tailwind)
  eslint-config/            # ESLint presets (base, nestjs, next)
  typescript-config/        # TSConfig presets
  i18n/                     # Shared i18n config
  server-shared/            # NestJS shared (filters, interceptors, config)
  shared/
    consts/                 # Shared constants
    types/                  # Shared TypeScript types
    exception/              # Exception codes
    utils/                  # Shared utilities
```

## Code Style

### TypeScript (STRICT)

- `noImplicitAny: true`, `strictNullChecks: true`
- NEVER use `as any`, `@ts-ignore`, `@ts-expect-error`
- Prefer `unknown` over `any`, narrow types explicitly
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### Formatting (Prettier)

- Single quotes, no semicolons at statement end: false (semicolons used)
- 120 char line width, 2 space indent
- Trailing commas in ES5 positions
- Arrow parens: avoid when possible

### ESLint Rules

- `no-console: error` - Use logger instead
- `@typescript-eslint/no-explicit-any: error`
- `@typescript-eslint/no-unused-vars: error`
- `@typescript-eslint/no-unnecessary-condition: error`

### Imports

- Use path aliases: `@/` for src root in each app
- ES modules (import/export), not CommonJS
- Destructure imports when possible
- Newline after import block

## API Patterns (NestJS)

### Module Structure

```
modules/<feature>/
  <feature>.module.ts       # Module definition
  <feature>.controller.ts   # HTTP endpoints
  <feature>.swagger.ts      # Swagger decorators (separate file)
  dto/                      # Request/Response DTOs
  use-case/                 # Business logic (one class per use-case)
  exception/                # Feature-specific exceptions
```

### Use-Case Pattern

- One use-case class per operation (CreateUserUseCase, FindUserUseCase)
- Single `execute()` method
- Inject dependencies via constructor
- Keep controllers thin - delegate to use-cases

### Exception Handling

```typescript
// Use CustomException from @repo/server-shared
import { CustomException } from '@repo/server-shared';
import { EXCEPTION_CODES } from '@repo/exception';

throw new CustomException({
  message: 'User not found',
  errorCode: EXCEPTION_CODES.USER_NOT_FOUND,
  statusCode: 404,
});
```

### Swagger Documentation

- Separate swagger decorators into `*.swagger.ts` files
- Use decorator composition for clean controllers
- ApiTags on controller class

### API Versioning

- URI versioning enabled: `/v1/users`
- Default version: 1

## Web Patterns (Next.js)

### App Router + i18n

- Using `next-intl` for internationalization
- Routes under `app/[locale]/`
- Supported locales: `en`, `ko` (in `messages/`)

### Styling

- Tailwind CSS with `@repo/ui` preset
- Use `cn()` utility from `@repo/ui` for class merging
- CVA (class-variance-authority) for component variants

### Components

- Import shared components from `@repo/ui`
- Use `lucide-react` for icons

## Mobile Patterns (Expo)

### Expo Router

- File-based routing in `app/` directory
- Typed routes enabled
- React Navigation under the hood

### Building

- Development: `pnpm mobile start`
- Production: Use EAS Build (not local builds)

## Desktop Patterns (Electron)

### Electron Forge

- Using `electron-forge` with Webpack plugin
- Main process: `src/index.ts`
- Renderer process: `src/renderer.ts`
- Preload script: `src/preload.ts`

### Building

- Development: `pnpm dev:desktop` or `pnpm desktop dev`
- Package: `pnpm desktop package`
- Make distributable: `pnpm desktop make`

### Notes

- Electron binary requires manual postinstall in pnpm monorepo
- Run `node node_modules/.pnpm/electron@*/node_modules/electron/install.js` if electron fails to start

## Testing

### API Tests

```bash
pnpm api test:unit          # Fast, isolated unit tests
pnpm api test:integration   # With database
pnpm api test:e2e           # Full HTTP tests
```

### Test Setup

- Jest with ts-jest
- Separate configs per test type in `test/<type>/jest.config.ts`
- Use `@faker-js/faker` for test data
- Integration tests need database (use `.env.test`)

## Environment Variables

### Required for API

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:6432/mydb?schema=public
API_PORT=8000
APP_ENV=local|staging|production
SWAGGER_USERNAME=xxx      # Required for non-local Swagger
SWAGGER_PASSWORD=xxx
```

### Database

- PostgreSQL via Docker on port 6432
- Container name: `my-monorepo-postgres`
- Start: `docker-compose up -d`

## Git Workflow

### Hooks (Husky)

- `pre-push`: Runs `pnpm lint`

### Branch/Commit

- Ensure lint passes before pushing
- Run `pnpm check-types` to verify TypeScript

## Common Tasks

### Add a new API feature module

1. Create `modules/<feature>/` directory
2. Add module, controller, DTOs, use-cases
3. Register module in `app.module.ts`
4. Add exception codes to `packages/shared/exception/`

### Add a new shared type

1. Add to `packages/shared/types/src/`
2. Export from `index.ts`
3. Import as `@repo/types` in consuming apps

### Add i18n translations

1. Add keys to `apps/web/src/messages/en.json` and `ko.json`
2. Use `useTranslations()` hook from `next-intl`

## Performance Notes

- Turborepo caches builds - use `turbo run build --force` to bypass
- Dev excludes mobile and desktop by default (use `pnpm dev:mobile` or `pnpm dev:desktop` separately)
- Prisma client auto-generates on install

## Troubleshooting

### Database connection issues

```bash
docker-compose down && docker-compose up -d
pnpm api prisma db push
```

### Type errors after package changes

```bash
pnpm api prisma generate    # Regenerate Prisma types
pnpm check-types            # Verify
```

### Clean rebuild

```bash
pnpm clean                  # Remove node_modules, dist, tsbuildinfo
pnpm install
pnpm build
```
