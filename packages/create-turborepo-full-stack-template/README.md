# create-turborepo-full-stack-template

Create a full-stack Turborepo project with Next.js, NestJS, Expo, and Electron in one command.

## Quick Start

```bash
# Using npx (recommended)
npx create-turborepo-full-stack-template my-project

# Using pnpx
pnpx create-turborepo-full-stack-template my-project
```

<br>

## What's Included

This template creates a complete monorepo with:

| App                           | Description             | Port |
| ----------------------------- | ----------------------- | ---- |
| `apps/<project-name>-api`     | NestJS 11 backend API   | 8000 |
| `apps/<project-name>-web`     | Next.js 16 web frontend | 3000 |
| `apps/<project-name>-app`     | Expo 54 mobile app      | -    |
| `apps/<project-name>-desktop` | Electron desktop app    | -    |

### Shared Packages

- `@repo/ui` - Shared React components (CVA + Tailwind)
- `@repo/eslint-config` - ESLint presets (base, nestjs, next)
- `@repo/typescript-config` - TypeScript configs
- `@repo/server-shared` - NestJS shared utilities (filters, interceptors, config)
- `@repo/i18n` - Internationalization config
- `@repo/types` - Shared TypeScript types
- `@repo/utils` - Shared utilities
- `@repo/consts` - Shared constants
- `@repo/exception` - Exception codes

<br>

## Usage
### Interactive Mode

```bash
npx create-turborepo-full-stack-template
```

<br>

### With Project Name

```bash
npx create-turborepo-full-stack-template my-awesome-project
```

<br>

### Skip Dependency Installation

```bash
npx create-turborepo-full-stack-template my-project --skip-install
```

<br>

## Options

| Option           | Description                        |
| ---------------- | ---------------------------------- |
| `--skip-install` | Skip `pnpm install` after creation |
| `--help, -h`     | Show help message                  |
| `--version, -v`  | Show version                       |

<br>

## After Creation

```bash
cd my-project

# Start PostgreSQL and push Prisma schema
pnpm setup:local

# Start development (API + Web)
pnpm dev
```


### Available Commands

```bash
pnpm dev                    # Start API + Web (not mobile/desktop)
pnpm build                  # Build all packages
pnpm lint                   # Lint with auto-fix
pnpm check-types            # TypeScript type check
pnpm test                   # Run all tests
pnpm format                 # Prettier format all files
```

<br>

### App Generator

Add new apps to your project using the built-in CLI generator:

```bash
pnpm create-app                           # Interactive mode
pnpm create-app <name> --from <template>  # Create new app from template
pnpm create-app --list                    # List available templates
```

Available templates: `mobile`, `desktop`, `web`, `api`

<br>

### App-Specific Commands

```bash
# Use pnpm <project-name>-<app> <command>
pnpm my-project-api dev              # Start API only
pnpm my-project-web dev              # Start Web only
pnpm my-project-api prisma studio    # Open Prisma Studio
pnpm my-project-api prisma generate  # Generate Prisma client
pnpm my-project-api prisma db push   # Push schema changes

# API Testing
pnpm my-project-api test:unit        # Fast, isolated unit tests
pnpm my-project-api test:integration # With database
pnpm my-project-api test:e2e         # Full HTTP tests
```

<br>

## Requirements

- Node.js >= 18 (Node.js >= 22 recommended for the generated project)
- pnpm (v10+ recommended)
- Docker (for PostgreSQL)

<br>

## Tech Stack

- **Build System**: Turborepo
- **Package Manager**: pnpm 10
- **Backend**: NestJS 11, Prisma 6
- **Frontend**: Next.js 16, React 19
- **Mobile**: Expo 54, React Native 0.81
- **Desktop**: Electron with Forge
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5.9
- **Testing**: Jest, ts-jest

<br>

## Project Structure

```
apps/
  <project-name>-api/       # NestJS backend
    src/modules/            # Feature modules (use-case pattern)
    src/infra/              # Infrastructure (database, etc.)
    prisma/schema/          # Prisma schema files
    test/                   # unit/, integration/, e2e/
  <project-name>-web/       # Next.js frontend (App Router)
    src/app/[locale]/       # i18n routes with next-intl
    src/messages/           # en.json, ko.json
  <project-name>-app/       # Expo mobile app
  <project-name>-desktop/   # Electron desktop app

packages/
  ui/                       # Shared React components
  eslint-config/            # ESLint presets
  typescript-config/        # TSConfig presets
  i18n/                     # Shared i18n config
  server-shared/            # NestJS shared utilities
  shared/
    consts/                 # Shared constants
    types/                  # Shared TypeScript types
    exception/              # Exception codes
    utils/                  # Shared utilities
```

<br>

## License

MIT
