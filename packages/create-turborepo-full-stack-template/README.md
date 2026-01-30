# create-turborepo-full-stack-template

Create a full-stack Turborepo project with Next.js, NestJS, Expo, and Electron in one command.

## Quick Start

```bash
# Create an empty directory and run from it
mkdir my-project && cd my-project
npx create-turborepo-full-stack-template my-project
```

<br>

## What's Included

This template creates a complete monorepo with:

| Template  | Description             | Port |
| --------- | ----------------------- | ---- |
| `api`     | NestJS 11 backend API   | 8000 |
| `web`     | Next.js 16 web frontend | 3000 |
| `mobile`  | Expo 54 mobile app      | -    |
| `desktop` | Electron desktop app    | -    |

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
mkdir my-project && cd my-project
npx create-turborepo-full-stack-template my-awesome-project
```

<br>

### Skip Dependency Installation

```bash
mkdir my-project && cd my-project
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
# Create your first app
pnpm create-app

# Start PostgreSQL
pnpm setup:local

# Start development (after creating apps)
pnpm dev
```

<br>

## Customize Package Scope

The default package scope is `@repo/`. You can change it to your preferred scope:

### Using CLI Script

```bash
# Preview changes (dry-run)
pnpm rename-scope mycompany --dry-run

# Apply changes (@repo/ → @mycompany/)
pnpm rename-scope mycompany

# Reinstall dependencies after renaming
pnpm install
```

### Using Claude Code

If you use Claude Code, you can easily change it with a command:

```
/rename-scope mycompany
```

Claude Code will automatically perform a dry-run, apply changes, reinstall dependencies, and verify the build.

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

After creating apps with `pnpm create-app`, use:

```bash
pnpm <app-name> dev              # Start app in dev mode
pnpm <app-name> build            # Build app
# For API apps:
pnpm <app-name> prisma studio    # Open Prisma Studio
pnpm <app-name> test:unit        # Unit tests
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
templates/                  # App templates for CLI generator
  api/                      # NestJS backend template
  web/                      # Next.js frontend template
  mobile/                   # Expo mobile template
  desktop/                  # Electron desktop template

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
