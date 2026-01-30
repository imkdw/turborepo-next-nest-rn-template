# Rename Package Scope

Changes the package scope of the user's monorepo.

## Usage

This command receives the new scope name via `$ARGUMENTS`.
Example: `/rename-scope mycompany` → `@repo/` → `@mycompany/`

## Execution Steps

1. If no arguments are provided, ask the user for the new scope name.
2. First run `pnpm rename-scope {new-scope-name} --dry-run` to preview which files will be changed.
3. Show the dry-run results to the user and confirm whether to proceed.
4. After confirmation, run `pnpm rename-scope {new-scope-name}` to apply changes.
5. Run `pnpm install` to re-link dependencies.
6. Run `pnpm build` to verify the build succeeds.
7. Summarize the results to the user.
