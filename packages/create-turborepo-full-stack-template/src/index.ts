#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';
import pc from 'picocolors';

// =============================================================================
// Constants
// =============================================================================

const REPO_URL = 'imkdw/turborepo-full-stack-template';
const DEFAULT_PROJECT_NAME = 'my-turborepo';

// Directories to exclude from processing
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', '.next', '.turbo', '.expo'];

// Binary file extensions to skip during replacement
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

// Files to exclude from replacement (tsbuildinfo, lock files, etc.)
const EXCLUDE_FILES = ['tsconfig.tsbuildinfo', 'pnpm-lock.yaml', 'package-lock.json', 'yarn.lock'];

// =============================================================================
// Types
// =============================================================================

interface CliOptions {
  projectName?: string;
  skipInstall: boolean;
  help: boolean;
  version: boolean;
}

// =============================================================================
// Utility Functions
// =============================================================================

function printBanner(): void {
  console.log('');
  console.log(pc.cyan('  ██╗███╗   ███╗██╗  ██╗██████╗ ██╗    ██╗'));
  console.log(pc.cyan('  ██║████╗ ████║██║ ██╔╝██╔══██╗██║    ██║'));
  console.log(pc.cyan('  ██║██╔████╔██║█████╔╝ ██║  ██║██║ █╗ ██║'));
  console.log(pc.cyan('  ██║██║╚██╔╝██║██╔═██╗ ██║  ██║██║███╗██║'));
  console.log(pc.cyan('  ██║██║ ╚═╝ ██║██║  ██╗██████╔╝╚███╔███╔╝'));
  console.log(pc.cyan('  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═════╝  ╚══╝╚══╝ '));
  console.log('');
  console.log(pc.bold('  Full-Stack Turborepo Template'));
  console.log(pc.dim('  Next.js + NestJS + Expo + Electron'));
  console.log('');
}

function printHelp(): void {
  console.log(`
${pc.bold('Usage:')}
  npx create-turborepo-full-stack-template [project-name] [options]
  pnpx create-turborepo-full-stack-template [project-name] [options]

${pc.bold('Options:')}
  --skip-install    Skip dependency installation
  --help, -h        Show this help message
  --version, -v     Show version

${pc.bold('Examples:')}
  npx create-turborepo-full-stack-template my-app
  npx create-turborepo-full-stack-template my-app --skip-install

${pc.bold('What\'s included:')}
  ${pc.cyan('apps/<project-name>-api')}      NestJS 11 backend API
  ${pc.cyan('apps/<project-name>-web')}      Next.js 16 web frontend
  ${pc.cyan('apps/<project-name>-app')}      Expo 54 mobile app
  ${pc.cyan('apps/<project-name>-desktop')}  Electron desktop app
  ${pc.cyan('packages/*')}                   Shared packages (ui, config, types, etc.)
`);
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    projectName: undefined,
    skipInstall: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--version' || arg === '-v') {
      options.version = true;
    } else if (arg === '--skip-install') {
      options.skipInstall = true;
    } else if (!arg.startsWith('-') && !options.projectName) {
      options.projectName = arg;
    }
  }

  return options;
}

function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: 'Project name is required' };
  }

  // Allow "." for current directory
  if (name === '.') {
    return { valid: true };
  }

  if (name.includes('..') || name.includes('/') || name.includes('\\')) {
    return { valid: false, error: 'Project name cannot contain path characters' };
  }

  if (name.length < 2 || name.length > 50) {
    return { valid: false, error: 'Project name must be between 2 and 50 characters' };
  }

  const validPattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: 'Project name must be lowercase, start with a letter, and only contain alphanumeric characters and hyphens',
    };
  }

  return { valid: true };
}

function isDirectoryEmpty(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) {
    return true;
  }
  const files = fs.readdirSync(dirPath);
  // Allow .git and other hidden files
  const nonHiddenFiles = files.filter((f) => !f.startsWith('.'));
  return nonHiddenFiles.length === 0;
}

function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

// =============================================================================
// Core Functions
// =============================================================================

async function downloadTemplate(projectPath: string): Promise<void> {
  console.log(pc.cyan('→') + ' Downloading template...');

  try {
    // Use npx tiged to download template
    execSync(`npx tiged ${REPO_URL} "${projectPath}" --disable-cache`, {
      stdio: 'pipe',
    });

    // Verify download was successful by checking for essential files
    const essentialFiles = ['package.json', 'pnpm-workspace.yaml', 'turbo.json'];
    const missingFiles = essentialFiles.filter((file) => !fs.existsSync(path.join(projectPath, file)));

    if (missingFiles.length > 0) {
      throw new Error(`Template download incomplete. Missing files: ${missingFiles.join(', ')}`);
    }

    console.log(pc.green('✓') + ' Template downloaded');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Provide more helpful error messages for common issues
    if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('network')) {
      throw new Error('Network error: Unable to connect to GitHub. Please check your internet connection.');
    }
    if (errorMessage.includes('rate limit') || errorMessage.includes('403')) {
      throw new Error('GitHub rate limit exceeded. Please try again later or use a GitHub token.');
    }
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      throw new Error(`Template repository not found: ${REPO_URL}`);
    }

    throw new Error(`Failed to download template: ${errorMessage}`);
  }
}

function getAllFiles(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        getAllFiles(fullPath, files);
      }
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function isBinaryFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.includes(ext);
}

function isExcludedFile(filePath: string): boolean {
  const fileName = path.basename(filePath);
  return EXCLUDE_FILES.includes(fileName);
}

function replaceInFile(filePath: string, replacements: Map<string, string>): boolean {
  // Skip binary and excluded files
  if (isBinaryFile(filePath) || isExcludedFile(filePath)) {
    return false;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    for (const [from, to] of replacements) {
      if (content.includes(from)) {
        content = content.split(from).join(to);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
    }

    return modified;
  } catch {
    // Log error for debugging but don't fail the entire process
    console.log(pc.yellow('⚠') + ` Failed to process: ${path.basename(filePath)}`);
    return false;
  }
}

function updateProjectName(projectPath: string, projectName: string): void {
  console.log(pc.cyan('→') + ' Updating project name...');

  const kebabName = toKebabCase(projectName);
  const pascalName = toPascalCase(projectName);

  // Create replacement map
  // Order matters: more specific patterns should come before general ones
  const replacements = new Map<string, string>([
    // ==========================================================================
    // Template package names (templates use @repo/template-* naming)
    // ==========================================================================
    ['@repo/template-api', `@repo/${kebabName}-api`],
    ['@repo/template-web', `@repo/${kebabName}-web`],
    ['@repo/template-mobile', `@repo/${kebabName}-app`],
    ['@repo/template-desktop', `@repo/${kebabName}-desktop`],

    // ==========================================================================
    // Standard package names (my-* naming in apps/)
    // ==========================================================================
    ['my-monorepo', kebabName],
    ['@repo/my-api', `@repo/${kebabName}-api`],
    ['@repo/my-web', `@repo/${kebabName}-web`],
    ['@repo/my-app', `@repo/${kebabName}-app`],
    ['@repo/my-desktop', `@repo/${kebabName}-desktop`],

    // ==========================================================================
    // Directory references
    // ==========================================================================
    ['apps/my-api', `apps/${kebabName}-api`],
    ['apps/my-web', `apps/${kebabName}-web`],
    ['apps/my-app', `apps/${kebabName}-app`],
    ['apps/my-desktop', `apps/${kebabName}-desktop`],

    // ==========================================================================
    // Docker container and database names
    // ==========================================================================
    // Test database name (more specific pattern first)
    ['turborepo-template-postgres-test', `${kebabName}-postgres-test`],
    // Main database/container name
    ['turborepo-template-postgres', `${kebabName}-postgres`],

    // ==========================================================================
    // Expo app.json patterns (both template-mobile and my-app)
    // ==========================================================================
    ['"name": "template-mobile"', `"name": "${kebabName}-app"`],
    ['"slug": "template-mobile"', `"slug": "${kebabName}-app"`],
    ['"scheme": "template-mobile"', `"scheme": "${kebabName}-app"`],
    ['"name": "my-app"', `"name": "${kebabName}-app"`],
    ['"slug": "my-app"', `"slug": "${kebabName}-app"`],
    ['"scheme": "my-app"', `"scheme": "${kebabName}-app"`],

    // ==========================================================================
    // Electron productName patterns (both template-desktop and my-desktop)
    // ==========================================================================
    ['"productName": "template-desktop"', `"productName": "${pascalName}Desktop"`],
    ['"productName": "my-desktop"', `"productName": "${pascalName}Desktop"`],

    // ==========================================================================
    // pnpm filter commands
    // ==========================================================================
    ['pnpm my-api', `pnpm ${kebabName}-api`],
    ['pnpm my-web', `pnpm ${kebabName}-web`],
    ['pnpm my-app', `pnpm ${kebabName}-app`],
    ['pnpm my-desktop', `pnpm ${kebabName}-desktop`],

    // ==========================================================================
    // Script names in root package.json
    // ==========================================================================
    ['"my-api":', `"${kebabName}-api":`],
    ['"my-web":', `"${kebabName}-web":`],
    ['"my-app":', `"${kebabName}-app":`],
    ['"my-desktop":', `"${kebabName}-desktop":`],

    // ==========================================================================
    // CLAUDE.md template headers
    // ==========================================================================
    ['template-api (NestJS)', `${kebabName}-api (NestJS)`],
    ['template-web (Next.js)', `${kebabName}-web (Next.js)`],
    ['template-mobile (Expo)', `${kebabName}-app (Expo)`],
    ['template-desktop (Electron)', `${kebabName}-desktop (Electron)`],

    // ==========================================================================
    // Generic template-* to kebab-* replacements (for any remaining references)
    // ==========================================================================
    ['template-api', `${kebabName}-api`],
    ['template-web', `${kebabName}-web`],
    ['template-mobile', `${kebabName}-app`],
    ['template-desktop', `${kebabName}-desktop`],
  ]);

  // Get all files and update them
  const files = getAllFiles(projectPath);
  let updatedCount = 0;

  for (const file of files) {
    if (replaceInFile(file, replacements)) {
      updatedCount++;
    }
  }

  // Rename directories
  const appsDir = path.join(projectPath, 'apps');
  if (fs.existsSync(appsDir)) {
    const appDirs = [
      { from: 'my-api', to: `${kebabName}-api` },
      { from: 'my-web', to: `${kebabName}-web` },
      { from: 'my-app', to: `${kebabName}-app` },
      { from: 'my-desktop', to: `${kebabName}-desktop` },
    ];

    for (const { from, to } of appDirs) {
      const fromPath = path.join(appsDir, from);
      const toPath = path.join(appsDir, to);
      if (fs.existsSync(fromPath)) {
        fs.renameSync(fromPath, toPath);
      }
    }
  }

  console.log(pc.green('✓') + ` Updated ${updatedCount} files`);
}

function cleanupTemplate(projectPath: string): void {
  console.log(pc.cyan('→') + ' Cleaning up...');

  // Remove template-specific files and directories
  const filesToRemove = [
    // Template directories
    'templates',
    'scripts/create-app.ts',
    '.sisyphus',
    '.claude',
    // GitHub workflow for NPM publishing (specific to CLI package)
    '.github/workflows/publish.yml',
    // Lock file should be regenerated
    'pnpm-lock.yaml',
    // Build artifacts
    'tsconfig.tsbuildinfo',
  ];

  for (const file of filesToRemove) {
    const filePath = path.join(projectPath, file);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }

  // Remove create-turborepo-full-stack-template package from packages
  const cliPackagePath = path.join(projectPath, 'packages', 'create-turborepo-full-stack-template');
  if (fs.existsSync(cliPackagePath)) {
    fs.rmSync(cliPackagePath, { recursive: true, force: true });
  }

  // Remove tsbuildinfo files from all subdirectories
  const tsbuildInfoFiles = getAllFiles(projectPath).filter((f) => f.endsWith('.tsbuildinfo'));
  for (const file of tsbuildInfoFiles) {
    fs.rmSync(file, { force: true });
  }

  // Update pnpm-workspace.yaml to remove templates entry
  const workspacePath = path.join(projectPath, 'pnpm-workspace.yaml');
  if (fs.existsSync(workspacePath)) {
    let content = fs.readFileSync(workspacePath, 'utf-8');
    // Handle various YAML formatting styles:
    // - "templates/*", - 'templates/*', - templates/*, - templates/**
    content = content.replace(/^\s*-\s*["']?templates\/\*{1,2}["']?\s*$/gm, '');
    // Remove empty lines left over
    content = content.replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(workspacePath, content.trim() + '\n');
  }

  // Create .env from .env.example if it exists
  const envExamplePath = path.join(projectPath, '.env.example');
  const envPath = path.join(projectPath, '.env');
  if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
  }

  // Initialize new git repository
  try {
    execSync('git init', { cwd: projectPath, stdio: 'ignore' });
    console.log(pc.green('✓') + ' Initialized git repository');
  } catch {
    // Git might not be available
  }

  console.log(pc.green('✓') + ' Cleanup complete');
}

async function installDependencies(projectPath: string): Promise<boolean> {
  console.log(pc.cyan('→') + ' Installing dependencies...');
  console.log(pc.dim('  This may take a few minutes...'));

  return new Promise((resolve) => {
    const proc = spawn('pnpm', ['install'], {
      cwd: projectPath,
      stdio: 'inherit',
      shell: true,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(pc.green('✓') + ' Dependencies installed');
        resolve(true);
      } else {
        console.log(pc.yellow('⚠') + ' Failed to install dependencies');
        resolve(false);
      }
    });

    proc.on('error', () => {
      console.log(pc.yellow('⚠') + ' Failed to install dependencies');
      resolve(false);
    });
  });
}

function printNextSteps(projectName: string, skipInstall: boolean, isCurrentDir = false): void {
  const kebabName = toKebabCase(projectName);

  console.log('');
  console.log(pc.green('✓') + pc.bold(' Project created successfully!'));
  console.log('');
  console.log(pc.bold('Next steps:'));
  console.log('');

  if (!isCurrentDir) {
    console.log(`  ${pc.cyan('cd')} ${projectName}`);
  }

  if (skipInstall) {
    console.log(`  ${pc.cyan('pnpm')} install`);
  }

  console.log(`  ${pc.cyan('pnpm')} setup:local       ${pc.dim('# Start PostgreSQL and push schema')}`);
  console.log(`  ${pc.cyan('pnpm')} dev               ${pc.dim('# Start API + Web')}`);
  console.log('');
  console.log(pc.bold('Available commands:'));
  console.log('');
  console.log(`  ${pc.cyan('pnpm')} dev               ${pc.dim('# Start API + Web in dev mode')}`);
  console.log(`  ${pc.cyan('pnpm')} dev:mobile        ${pc.dim('# Start Expo mobile app')}`);
  console.log(`  ${pc.cyan('pnpm')} dev:desktop       ${pc.dim('# Start Electron desktop app')}`);
  console.log(`  ${pc.cyan('pnpm')} build             ${pc.dim('# Build all packages')}`);
  console.log(`  ${pc.cyan('pnpm')} lint              ${pc.dim('# Lint all packages')}`);
  console.log(`  ${pc.cyan('pnpm')} test              ${pc.dim('# Run all tests')}`);
  console.log('');
  console.log(pc.bold('App-specific commands:'));
  console.log('');
  console.log(`  ${pc.cyan('pnpm')} ${kebabName}-api dev       ${pc.dim('# Start API only')}`);
  console.log(`  ${pc.cyan('pnpm')} ${kebabName}-web dev       ${pc.dim('# Start Web only')}`);
  console.log(`  ${pc.cyan('pnpm')} ${kebabName}-app start     ${pc.dim('# Start Mobile app')}`);
  console.log(`  ${pc.cyan('pnpm')} ${kebabName}-desktop dev   ${pc.dim('# Start Desktop app')}`);
  console.log('');
  console.log(pc.dim('Happy coding!'));
  console.log('');
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  // Handle help and version
  if (options.help) {
    printBanner();
    printHelp();
    process.exit(0);
  }

  if (options.version) {
    const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
    console.log(pkg.version);
    process.exit(0);
  }

  printBanner();

  // Get project name
  let projectName: string;

  if (options.projectName) {
    const validation = validateProjectName(options.projectName);
    if (!validation.valid) {
      console.error(pc.red(`Error: ${validation.error}`));
      process.exit(1);
    }
    projectName = options.projectName;
  } else {
    const response = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'Project name',
      initial: DEFAULT_PROJECT_NAME,
      validate: (value: string) => {
        const result = validateProjectName(value);
        return result.valid ? true : result.error ?? 'Invalid name';
      },
    });

    if (!response.projectName) {
      console.log(pc.yellow('Aborted.'));
      process.exit(0);
    }

    projectName = response.projectName as string;
  }

  // Handle "." for current directory
  const isCurrentDir = projectName === '.';
  const projectPath = isCurrentDir ? process.cwd() : path.resolve(process.cwd(), projectName);
  const actualProjectName = isCurrentDir ? path.basename(projectPath) : projectName;

  // Check if directory exists and is not empty
  if (isCurrentDir) {
    if (!isDirectoryEmpty(projectPath)) {
      console.error(pc.red('Error: Current directory is not empty'));
      console.error(pc.dim('Hint: Use an empty directory or specify a new project name'));
      process.exit(1);
    }
  } else if (fs.existsSync(projectPath)) {
    console.error(pc.red(`Error: Directory "${projectName}" already exists`));
    process.exit(1);
  }

  console.log('');
  console.log(pc.bold(`Creating ${pc.cyan(actualProjectName)}${isCurrentDir ? ' in current directory' : ''}...`));
  console.log('');

  try {
    // Download template
    await downloadTemplate(projectPath);

    // Update project name (use actual name derived from directory)
    updateProjectName(projectPath, actualProjectName);

    // Cleanup template files
    cleanupTemplate(projectPath);

    // Install dependencies
    if (!options.skipInstall) {
      await installDependencies(projectPath);
    }

    // Print next steps
    printNextSteps(actualProjectName, options.skipInstall, isCurrentDir);
  } catch (error) {
    console.error(pc.red('Error:'), error instanceof Error ? error.message : error);

    // Cleanup on error
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true });
    }

    process.exit(1);
  }
}

main().catch((error) => {
  console.error(pc.red('Unexpected error:'), error);
  process.exit(1);
});
