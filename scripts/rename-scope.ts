import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');

const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', '.next', '.turbo', '.expo', '.webpack', 'out'];

const BINARY_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.webp',
  '.svg',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.otf',
  '.mp3',
  '.mp4',
  '.wav',
  '.pdf',
  '.zip',
  '.tar',
  '.gz',
];

const EXCLUDE_FILES = ['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'tsconfig.tsbuildinfo'];

/**
 * Detects the current package scope by reading package.json files
 */
function detectCurrentScope(): string {
  const packagesDir = path.join(ROOT_DIR, 'packages');
  const entries = fs.readdirSync(packagesDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pkgPath = path.join(packagesDir, entry.name, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      const match = (pkg.name as string).match(/^(@[^/]+)\//);
      if (match) return match[1];
    }
  }

  throw new Error('Cannot detect current package scope. Ensure at least one package in packages/ has a scoped name.');
}

/**
 * Validates the scope name format
 */
function validateScope(scope: string): { valid: boolean; error?: string } {
  if (scope.length < 2 || scope.length > 50) {
    return { valid: false, error: 'Scope must be between 2 and 50 characters' };
  }
  const validPattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
  if (!validPattern.test(scope)) {
    return {
      valid: false,
      error: 'Scope must be lowercase, start with a letter, and only contain alphanumeric characters and hyphens',
    };
  }
  return { valid: true };
}

/**
 * Normalizes scope input by removing @ prefix if present
 */
function normalizeScope(input: string): string {
  return input.startsWith('@') ? input.slice(1) : input;
}

/**
 * Recursively gets all files in a directory, excluding specified directories
 */
function getAllFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string): void {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          if (!EXCLUDE_DIRS.includes(entry.name)) {
            traverse(fullPath);
          }
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories that can't be read
      console.warn(`Warning: Cannot read directory ${currentDir}`);
    }
  }

  traverse(dir);
  return files;
}

/**
 * Checks if a file is a binary file based on extension
 */
function isBinaryFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.includes(ext);
}

/**
 * Checks if a file should be excluded from processing
 */
function isExcludedFile(filePath: string): boolean {
  return EXCLUDE_FILES.includes(path.basename(filePath));
}

/**
 * Replaces text in a file
 * Returns true if the file was changed, false otherwise
 */
function replaceInFile(filePath: string, fromStr: string, toStr: string, dryRun: boolean): boolean {
  if (isBinaryFile(filePath) || isExcludedFile(filePath)) return false;

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes(fromStr)) return false;

    if (!dryRun) {
      const newContent = content.split(fromStr).join(toStr);
      fs.writeFileSync(filePath, newContent);
    }
    return true;
  } catch {
    // Skip files that can't be read as text
    return false;
  }
}

function main(): void {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const scopeArg = args.find((a) => !a.startsWith('-'));

  if (!scopeArg) {
    console.error('Usage: pnpm rename-scope <new-scope> [--dry-run]');
    console.error('Example: pnpm rename-scope mycompany');
    process.exit(1);
  }

  const newScopeName = normalizeScope(scopeArg);
  const validation = validateScope(newScopeName);
  if (!validation.valid) {
    console.error(`Error: ${validation.error}`);
    process.exit(1);
  }

  const currentScope = detectCurrentScope();
  const newScope = `@${newScopeName}`;

  if (currentScope === newScope) {
    console.log(`Current scope is already "${newScope}". Nothing to do.`);
    process.exit(0);
  }

  const fromStr = `${currentScope}/`;
  const toStr = `${newScope}/`;

  console.log(dryRun ? '\n=== DRY RUN ===' : '');
  console.log(`\nRenaming scope: ${currentScope}/ → ${newScope}/\n`);

  const files = getAllFiles(ROOT_DIR);
  const changedFiles: string[] = [];

  for (const file of files) {
    if (replaceInFile(file, fromStr, toStr, dryRun)) {
      const relativePath = path.relative(ROOT_DIR, file);
      changedFiles.push(relativePath);
    }
  }

  // Summary
  if (changedFiles.length === 0) {
    console.log('No files needed changes.');
  } else {
    console.log(`${dryRun ? 'Files that would be changed' : 'Changed files'} (${changedFiles.length}):\n`);
    for (const file of changedFiles) {
      console.log(`  ${file}`);
    }
  }

  console.log(`\n${dryRun ? '[DRY RUN] No files were modified.' : `Done! ${changedFiles.length} files updated.`}`);

  if (!dryRun && changedFiles.length > 0) {
    console.log('\nNext steps:');
    console.log('  1. Run "pnpm install" to reinstall dependencies');
    console.log('  2. Run "pnpm build" to verify the build');
  }
}

main();
