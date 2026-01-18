# create-turborepo-full-stack-template

Create a full-stack Turborepo project with Next.js, NestJS, Expo, and Electron in one command.

## Quick Start

```bash
# Using npx (recommended)
npx create-turborepo-full-stack-template my-project

# Using pnpx
pnpx create-turborepo-full-stack-template my-project
```

## What's Included

This template creates a complete monorepo with:

| App                         | Description               | Port |
| --------------------------- | ------------------------- | ---- |
| `apps/<project-name>-api`     | NestJS 11 backend API     | 8000 |
| `apps/<project-name>-web`     | Next.js 16 web frontend   | 3000 |
| `apps/<project-name>-app`     | Expo 54 mobile app        | -    |
| `apps/<project-name>-desktop` | Electron desktop app      | -    |

### Shared Packages

- `@repo/ui` - Shared React components (CVA + Tailwind)
- `@repo/eslint-config` - ESLint presets
- `@repo/typescript-config` - TypeScript configs
- `@repo/server-shared` - NestJS shared utilities
- `@repo/i18n` - Internationalization config
- `@repo/types` - Shared TypeScript types
- `@repo/utils` - Shared utilities
- `@repo/consts` - Shared constants
- `@repo/exception` - Exception codes

## Usage

### Interactive Mode

```bash
npx create-turborepo-full-stack-template
```

### With Project Name

```bash
npx create-turborepo-full-stack-template my-awesome-project
```

### Skip Dependency Installation

```bash
npx create-turborepo-full-stack-template my-project --skip-install
```

## Options

| Option           | Description                       |
| ---------------- | --------------------------------- |
| `--skip-install` | Skip `pnpm install` after creation |
| `--help, -h`     | Show help message                 |
| `--version, -v`  | Show version                      |

## After Creation

```bash
cd my-project

# Start PostgreSQL and push Prisma schema
pnpm setup:local

# Start development (API + Web)
pnpm dev

# Start mobile app (separate terminal)
pnpm dev:mobile

# Start desktop app (separate terminal)
pnpm dev:desktop
```

## Requirements

- Node.js >= 18
- pnpm >= 8
- Docker (for PostgreSQL)

## Tech Stack

- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Backend**: NestJS 11, Prisma 6
- **Frontend**: Next.js 16, React 19
- **Mobile**: Expo 54, React Native 0.81
- **Desktop**: Electron with Forge
- **Styling**: Tailwind CSS
- **Language**: TypeScript 5.9

## License

MIT
