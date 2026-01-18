import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawn } from 'child_process';
import prompts from 'prompts';
import ora, { type Ora } from 'ora';
import pc from 'picocolors';

// =============================================================================
// Types & Interfaces
// =============================================================================

interface JsonUpdate {
  path: string;
  value: string | ((appName: string, context?: Record<string, unknown>) => string);
}

interface TextReplacement {
  from: string;
  to: string | ((appName: string) => string);
}

interface TemplatePrompt {
  name: string;
  type: 'confirm' | 'select' | 'text';
  message: string;
  initial?: boolean | string;
  choices?: Array<{ title: string; value: string }>;
}

interface TemplateConfig {
  description: string;
  source: string;
  exclude: string[];
  jsonUpdates: Record<string, JsonUpdate[]>;
  textReplacements: Record<string, TextReplacement[]>;
  prompts?: TemplatePrompt[];
}

interface ParsedArgs {
  appName?: string;
  from?: string;
  dryRun: boolean;
  skipInstall: boolean;
  list: boolean;
  help: boolean;
}

interface RollbackState {
  appFolderCreated: boolean;
  rootPackageJsonBackup: string | null;
}

interface ExecutionContext {
  appName: string;
  template: string;
  dryRun: boolean;
  skipInstall: boolean;
  promptAnswers: Record<string, unknown>;
}

// =============================================================================
// Constants
// =============================================================================

const ROOT_DIR = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT_DIR, 'templates');
const APPS_DIR = path.join(ROOT_DIR, 'apps');

const RESERVED_NAMES = ['api', 'web', 'mobile', 'desktop'];

const COMMON_EXCLUDE = ['node_modules', '.turbo', 'dist'];

const TEMPLATES: Record<string, TemplateConfig> = {
  mobile: {
    description: 'Expo React Native mobile app',
    source: path.join(TEMPLATES_DIR, 'mobile'),
    exclude: [...COMMON_EXCLUDE, '.expo'],
    jsonUpdates: {
      'package.json': [
        { path: 'name', value: (appName) => `@repo/${appName}` },
      ],
      'app.json': [
        { path: 'expo.name', value: (appName) => appName },
        { path: 'expo.slug', value: (appName) => appName },
        { path: 'expo.scheme', value: (appName) => appName },
      ],
    },
    textReplacements: {
      'CLAUDE.md': [
        { from: 'template-mobile', to: (appName) => appName },
      ],
    },
  },
  desktop: {
    description: 'Electron desktop app',
    source: path.join(TEMPLATES_DIR, 'desktop'),
    exclude: [...COMMON_EXCLUDE, '.webpack', 'out'],
    jsonUpdates: {
      'package.json': [
        { path: 'name', value: (appName) => `@repo/${appName}` },
        { path: 'productName', value: (appName) => appName },
      ],
    },
    textReplacements: {
      'CLAUDE.md': [
        { from: 'template-desktop', to: (appName) => appName },
      ],
    },
  },
  web: {
    description: 'Next.js web app',
    source: path.join(TEMPLATES_DIR, 'web'),
    exclude: [...COMMON_EXCLUDE, '.next'],
    jsonUpdates: {
      'package.json': [
        { path: 'name', value: (appName) => `@repo/${appName}` },
      ],
    },
    textReplacements: {
      'CLAUDE.md': [
        { from: 'template-web', to: (appName) => appName },
      ],
    },
  },
  api: {
    description: 'NestJS backend API',
    source: path.join(TEMPLATES_DIR, 'api'),
    exclude: [...COMMON_EXCLUDE],
    jsonUpdates: {
      'package.json': [
        { path: 'name', value: (appName) => `@repo/${appName}` },
      ],
    },
    textReplacements: {
      'CLAUDE.md': [
        { from: 'template-api', to: (appName) => appName },
      ],
    },
    prompts: [
      {
        name: 'shareDatabase',
        type: 'confirm',
        message: 'Share database schema with existing API?',
        initial: true,
      },
    ],
  },
};

// =============================================================================
// Globals for cleanup
// =============================================================================

let currentSpinner: Ora | null = null;
let rollbackState: RollbackState = {
  appFolderCreated: false,
  rootPackageJsonBackup: null,
};
let currentAppPath: string | null = null;

// =============================================================================
// Utility Functions
// =============================================================================

function printHelp(): void {
  console.log(`
${pc.bold('Usage:')}
  pnpm create-app <app-name> --from <template>
  pnpm create-app                              ${pc.dim('(interactive mode)')}

${pc.bold('Options:')}
  --from, -f <template>  Template to use (mobile, desktop, web, api)
  --dry-run              Preview changes without creating files
  --skip-install         Skip pnpm install after creation
  --list                 List available templates
  --help                 Show this help message

${pc.bold('Examples:')}
  pnpm create-app my-app --from mobile
  pnpm create-app admin-panel --from web --skip-install
  pnpm create-app new-api -f api --dry-run

${pc.bold('Available Templates:')}
${Object.entries(TEMPLATES)
  .map(([name, config]) => `  ${pc.cyan(name.padEnd(10))} ${config.description}`)
  .join('\n')}
`);
}

function printList(): void {
  console.log(`\n${pc.bold('Available Templates:')}\n`);
  Object.entries(TEMPLATES).forEach(([name, config]) => {
    console.log(`  ${pc.cyan(name.padEnd(12))} ${config.description}`);
  });
  console.log('');
}

function parseArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {
    appName: undefined,
    from: undefined,
    dryRun: false,
    skipInstall: false,
    list: false,
    help: false,
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      result.help = true;
    } else if (arg === '--list' || arg === '-l') {
      result.list = true;
    } else if (arg === '--dry-run') {
      result.dryRun = true;
    } else if (arg === '--skip-install') {
      result.skipInstall = true;
    } else if (arg === '--from' || arg === '-f') {
      i++;
      result.from = args[i];
    } else if (!arg.startsWith('-') && !result.appName) {
      result.appName = arg;
    }

    i++;
  }

  return result;
}

function validateAppName(name: string): { valid: boolean; error?: string } {
  // Check for path traversal
  if (name.includes('..') || name.includes('./') || name.includes('/')) {
    return { valid: false, error: 'App name cannot contain path characters' };
  }

  // Check length
  if (name.length < 2 || name.length > 50) {
    return { valid: false, error: 'App name must be between 2 and 50 characters' };
  }

  // Check format: lowercase alphanumeric with hyphens
  const validPattern = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
  if (!validPattern.test(name)) {
    return {
      valid: false,
      error: 'App name must start with a letter, be lowercase, and only contain alphanumeric characters and hyphens',
    };
  }

  // Check reserved names
  if (RESERVED_NAMES.includes(name)) {
    return { valid: false, error: `"${name}" is a reserved name` };
  }

  return { valid: true };
}

function setDeep(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object' || current[part] === null) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  const lastPart = parts[parts.length - 1];
  current[lastPart] = value;
}

// =============================================================================
// Core Functions
// =============================================================================

function copyDirectory(src: string, dest: string, exclude: string[]): number {
  let fileCount = 0;

  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (exclude.includes(entry.name)) {
      continue;
    }

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      fileCount += copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
      fileCount++;
    }
  }

  return fileCount;
}

function updateJsonFile(filePath: string, updates: JsonUpdate[], appName: string, context?: Record<string, unknown>): void {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);

  for (const update of updates) {
    const value = typeof update.value === 'function' ? update.value(appName, context) : update.value;
    setDeep(json, update.path, value);
  }

  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
}

function replaceInTextFile(filePath: string, replacements: TextReplacement[], appName: string): void {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  for (const replacement of replacements) {
    const toValue = typeof replacement.to === 'function' ? replacement.to(appName) : replacement.to;
    content = content.split(replacement.from).join(toValue);
  }

  fs.writeFileSync(filePath, content);
}

function updateRootPackageJson(appName: string): string {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  const content = fs.readFileSync(packageJsonPath, 'utf-8');
  const backup = content;

  const json = JSON.parse(content);

  if (!json.scripts) {
    json.scripts = {};
  }

  json.scripts[appName] = `pnpm -F ${appName}`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2) + '\n');

  return backup;
}

function restoreRootPackageJson(backup: string): void {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json');
  fs.writeFileSync(packageJsonPath, backup);
}

function allocateDesktopPorts(): { port: number; loggerPort: number } {
  let maxPort = 9000;

  // Scan apps directory for existing forge.config.ts files
  const appsDir = APPS_DIR;
  if (fs.existsSync(appsDir)) {
    const entries = fs.readdirSync(appsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const forgeConfigPath = path.join(appsDir, entry.name, 'forge.config.ts');
      if (!fs.existsSync(forgeConfigPath)) continue;

      const content = fs.readFileSync(forgeConfigPath, 'utf-8');

      // Match port: NNNN
      const portMatch = content.match(/port:\s*(\d+)/);
      if (portMatch) {
        const port = parseInt(portMatch[1], 10);
        if (port > maxPort) {
          maxPort = port;
        }
      }
    }
  }

  // Also scan templates directory
  const templatesDir = TEMPLATES_DIR;
  if (fs.existsSync(templatesDir)) {
    const entries = fs.readdirSync(templatesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const forgeConfigPath = path.join(templatesDir, entry.name, 'forge.config.ts');
      if (!fs.existsSync(forgeConfigPath)) continue;

      const content = fs.readFileSync(forgeConfigPath, 'utf-8');

      const portMatch = content.match(/port:\s*(\d+)/);
      if (portMatch) {
        const port = parseInt(portMatch[1], 10);
        if (port > maxPort) {
          maxPort = port;
        }
      }
    }
  }

  return {
    port: maxPort + 1,
    loggerPort: maxPort + 101,
  };
}

function updateDesktopForgeConfig(appPath: string, ports: { port: number; loggerPort: number }): void {
  const forgeConfigPath = path.join(appPath, 'forge.config.ts');
  if (!fs.existsSync(forgeConfigPath)) {
    return;
  }

  let content = fs.readFileSync(forgeConfigPath, 'utf-8');

  // Replace port value
  content = content.replace(/port:\s*\d+/, `port: ${ports.port}`);
  // Replace loggerPort value
  content = content.replace(/loggerPort:\s*\d+/, `loggerPort: ${ports.loggerPort}`);

  fs.writeFileSync(forgeConfigPath, content);
}

async function rollback(state: RollbackState, appPath: string | null): Promise<void> {
  const rollbackSpinner = ora('Rolling back changes...').start();

  try {
    if (state.rootPackageJsonBackup) {
      restoreRootPackageJson(state.rootPackageJsonBackup);
    }

    if (state.appFolderCreated && appPath && fs.existsSync(appPath)) {
      fs.rmSync(appPath, { recursive: true, force: true });
    }

    rollbackSpinner.succeed('Rollback completed');
  } catch (error) {
    rollbackSpinner.fail('Rollback failed');
    console.error(pc.red('Manual cleanup may be required:'));
    if (appPath) {
      console.error(pc.red(`  - Delete folder: ${appPath}`));
    }
    console.error(pc.red('  - Restore root package.json manually'));
    throw error;
  }
}

function runCommand(command: string, args: string[], cwd: string): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      cwd,
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let output = '';

    proc.stdout?.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      output += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ success: code === 0, output });
    });

    proc.on('error', (error) => {
      resolve({ success: false, output: error.message });
    });
  });
}

async function runVerification(appName: string, _appPath: string, template: string): Promise<boolean> {
  // Run lint using pnpm -F from root directory for proper workspace resolution
  const lintSpinner = ora(`Running lint for ${appName}...`).start();
  currentSpinner = lintSpinner;

  const lintResult = await runCommand('pnpm', ['-F', `@repo/${appName}`, 'lint'], ROOT_DIR);
  if (!lintResult.success) {
    lintSpinner.fail(`Lint failed for ${appName}`);
    console.error(pc.red('\nLint output:'));
    console.error(lintResult.output);
    return false;
  }
  lintSpinner.succeed(`Lint passed for ${appName}`);

  // Desktop template uses 'package' instead of 'build'
  // Mobile template uses EAS build, so we skip build verification
  if (template === 'desktop' || template === 'mobile') {
    console.log(pc.dim(`Skipped: build verification (${template} uses ${template === 'desktop' ? 'package/make' : 'EAS Build'})`));
    currentSpinner = null;
    return true;
  }

  // Run build for web and api
  const buildSpinner = ora(`Building ${appName}...`).start();
  currentSpinner = buildSpinner;

  const buildResult = await runCommand('pnpm', ['-F', `@repo/${appName}`, 'build'], ROOT_DIR);
  if (!buildResult.success) {
    buildSpinner.fail(`Build failed for ${appName}`);
    console.error(pc.red('\nBuild output:'));
    console.error(buildResult.output);
    return false;
  }
  buildSpinner.succeed(`Build passed for ${appName}`);

  currentSpinner = null;
  return true;
}

async function runInteractiveMode(): Promise<ExecutionContext | null> {
  console.log(`\n${pc.bold('Create a new app')}\n`);

  // Select template
  const templateResponse = await prompts({
    type: 'select',
    name: 'template',
    message: 'Select a template',
    choices: Object.entries(TEMPLATES).map(([name, config]) => ({
      title: `${name} - ${config.description}`,
      value: name,
    })),
  });

  if (!templateResponse.template) {
    return null;
  }

  // Enter app name
  const nameResponse = await prompts({
    type: 'text',
    name: 'appName',
    message: 'Enter app name',
    validate: (value: string) => {
      const result = validateAppName(value);
      return result.valid ? true : result.error || 'Invalid name';
    },
  });

  if (!nameResponse.appName) {
    return null;
  }

  // Check if app already exists
  const appPath = path.join(APPS_DIR, nameResponse.appName);
  if (fs.existsSync(appPath)) {
    console.error(pc.red(`\nError: App "${nameResponse.appName}" already exists at ${appPath}`));
    return null;
  }

  // Skip install option
  const installResponse = await prompts({
    type: 'confirm',
    name: 'runInstall',
    message: 'Run pnpm install after creation?',
    initial: true,
  });

  if (installResponse.runInstall === undefined) {
    return null;
  }

  // Template-specific prompts
  const templateConfig = TEMPLATES[templateResponse.template];
  const promptAnswers: Record<string, unknown> = {};

  if (templateConfig.prompts) {
    for (const promptConfig of templateConfig.prompts) {
      const response = await prompts({
        type: promptConfig.type as 'confirm',
        name: promptConfig.name,
        message: promptConfig.message,
        initial: promptConfig.initial,
        choices: promptConfig.choices,
      } as prompts.PromptObject);

      if (response[promptConfig.name] === undefined) {
        return null;
      }

      promptAnswers[promptConfig.name] = response[promptConfig.name];
    }
  }

  return {
    appName: nameResponse.appName,
    template: templateResponse.template,
    dryRun: false,
    skipInstall: !installResponse.runInstall,
    promptAnswers,
  };
}

function printDryRun(context: ExecutionContext): void {
  const { appName, template } = context;
  const templateConfig = TEMPLATES[template];
  const appPath = path.join(APPS_DIR, appName);

  console.log(`\n${pc.bold(pc.cyan('=== DRY RUN MODE ==='))}\n`);

  console.log(`${pc.bold('Template:')} ${template} (${templateConfig.description})`);
  console.log(`${pc.bold('App Name:')} ${appName}`);
  console.log(`${pc.bold('Target Path:')} ${appPath}\n`);

  console.log(`${pc.bold('Files to be created:')}`);
  console.log(`  ${pc.dim('All files from')} ${templateConfig.source}`);
  console.log(`  ${pc.dim('Excluding:')} ${templateConfig.exclude.join(', ')}\n`);

  console.log(`${pc.bold('JSON file updates:')}`);
  for (const [file, updates] of Object.entries(templateConfig.jsonUpdates)) {
    console.log(`  ${pc.cyan(file)}:`);
    for (const update of updates) {
      const value = typeof update.value === 'function' ? update.value(appName) : update.value;
      console.log(`    ${update.path} → ${pc.green(value)}`);
    }
  }

  console.log(`\n${pc.bold('Text replacements:')}`);
  for (const [file, replacements] of Object.entries(templateConfig.textReplacements)) {
    console.log(`  ${pc.cyan(file)}:`);
    for (const replacement of replacements) {
      const to = typeof replacement.to === 'function' ? replacement.to(appName) : replacement.to;
      console.log(`    "${replacement.from}" → "${pc.green(to)}"`);
    }
  }

  if (template === 'desktop') {
    const ports = allocateDesktopPorts();
    console.log(`\n${pc.bold('Desktop port allocation:')}`);
    console.log(`  port: ${pc.green(ports.port.toString())}`);
    console.log(`  loggerPort: ${pc.green(ports.loggerPort.toString())}`);
  }

  console.log(`\n${pc.bold('Root package.json update:')}`);
  console.log(`  scripts.${appName} → ${pc.green(`pnpm -F ${appName}`)}\n`);

  console.log(`${pc.bold('Verification steps (after creation):')}`);
  console.log(`  1. pnpm install`);
  console.log(`  2. pnpm ${appName} lint`);
  if (template === 'desktop') {
    console.log(`  3. ${pc.dim('(build skipped - use pnpm ' + appName + ' package)')}\n`);
  } else if (template === 'mobile') {
    console.log(`  3. ${pc.dim('(build skipped - use EAS Build)')}\n`);
  } else {
    console.log(`  3. pnpm ${appName} build\n`);
  }

  console.log(pc.yellow('No files were created (dry-run mode).\n'));
}

function printNextSteps(appName: string, template: string): void {
  console.log(`\n${pc.green('✓')} App created successfully!\n`);

  console.log(`${pc.bold('Next steps:')}`);
  console.log(`  cd apps/${appName}`);

  switch (template) {
    case 'mobile':
      console.log(`  pnpm ${appName} dev     ${pc.dim('# Start Expo dev server')}`);
      console.log(`  pnpm ${appName} ios     ${pc.dim('# Run on iOS simulator')}`);
      console.log(`  pnpm ${appName} android ${pc.dim('# Run on Android emulator')}`);
      break;
    case 'desktop':
      console.log(`  pnpm ${appName} dev     ${pc.dim('# Start Electron in dev mode')}`);
      console.log(`  pnpm ${appName} package ${pc.dim('# Package the app')}`);
      console.log(`  pnpm ${appName} make    ${pc.dim('# Create distributable')}`);
      break;
    case 'web':
      console.log(`  pnpm ${appName} dev     ${pc.dim('# Start Next.js dev server')}`);
      console.log(`  pnpm ${appName} build   ${pc.dim('# Production build')}`);
      break;
    case 'api':
      console.log(`  pnpm ${appName} dev     ${pc.dim('# Start NestJS in watch mode')}`);
      console.log(`  pnpm ${appName} test    ${pc.dim('# Run tests')}`);
      break;
  }

  // Manual checks section
  console.log(`\n${pc.bold(pc.yellow('⚠ Manual checks required:'))}`);

  // Claude users
  console.log(`\n  ${pc.cyan('If using Claude Code:')}`);
  console.log(`    Check ${pc.bold('.claude/settings.local.json')} to allow commands for the new app`);
  console.log(`    ${pc.dim('Add "Bash(pnpm ' + appName + ' *)" to permissions.allow array')}`);

  // Template-specific manual checks
  switch (template) {
    case 'mobile':
      console.log(`\n  ${pc.cyan('Mobile app setup:')}`);
      console.log(`    - Update ${pc.bold('app.json')}: display name, expo.ios.bundleIdentifier, expo.android.package`);
      console.log(`    - Configure EAS project: ${pc.dim('eas init')}`);
      console.log(`    - Set up app icons and splash screen in ${pc.bold('assets/')} directory`);
      break;
    case 'desktop':
      console.log(`\n  ${pc.cyan('Desktop app setup:')}`);
      console.log(`    - Update app icons in ${pc.bold('assets/')} directory`);
      console.log(`    - Configure ${pc.bold('forge.config.ts')} for your platform targets`);
      console.log(`    - Update ${pc.bold('package.json')} author and description fields`);
      console.log(`    ${pc.dim('Note: Ports have been auto-allocated to avoid conflicts')}`);
      break;
    case 'web':
      console.log(`\n  ${pc.cyan('Web app setup:')}`);
      console.log(`    - Update ${pc.bold('src/app/layout.tsx')} metadata (title, description)`);
      console.log(`    - Add i18n translations in ${pc.bold('src/messages/')} if using next-intl`);
      console.log(`    - Configure environment variables in ${pc.bold('.env.local')} if needed`);
      break;
    case 'api':
      console.log(`\n  ${pc.cyan('API app setup:')}`);
      console.log(`    - Set up ${pc.bold('.env')} file with DATABASE_URL and other required variables`);
      console.log(`    - Run ${pc.dim('pnpm ' + appName + ' prisma db push')} to sync database schema`);
      console.log(`    - Update CORS origins in ${pc.bold('src/main.ts')} with your production domain`);
      console.log(`    - Update Swagger title/description in ${pc.bold('src/main.ts')}`);
      break;
  }

  // Common checks for all templates
  console.log(`\n  ${pc.cyan('General:')}`);
  console.log(`    - Review and update ${pc.bold('apps/' + appName + '/CLAUDE.md')} for project-specific instructions`);
  console.log(`    - Check ${pc.bold('turbo.json')} if custom build/cache settings are needed`);

  console.log('');
}

// =============================================================================
// Main Execution
// =============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  // Handle --help
  if (parsed.help) {
    printHelp();
    process.exit(0);
  }

  // Handle --list
  if (parsed.list) {
    printList();
    process.exit(0);
  }

  let context: ExecutionContext;

  // Interactive mode if no arguments
  if (!parsed.appName && !parsed.from) {
    const interactiveResult = await runInteractiveMode();
    if (!interactiveResult) {
      console.log(pc.yellow('\nAborted.'));
      process.exit(0);
    }
    context = interactiveResult;
  } else {
    // CLI mode - validate arguments
    if (!parsed.appName) {
      console.error(pc.red('Error: App name is required'));
      console.error(pc.dim('Run "pnpm create-app --help" for usage'));
      process.exit(1);
    }

    if (!parsed.from) {
      console.error(pc.red('Error: Template is required (--from <template>)'));
      console.error(pc.dim('Run "pnpm create-app --list" to see available templates'));
      process.exit(1);
    }

    // Validate template
    if (!TEMPLATES[parsed.from]) {
      console.error(pc.red(`Error: Unknown template "${parsed.from}"`));
      console.error(pc.dim('Run "pnpm create-app --list" to see available templates'));
      process.exit(1);
    }

    // Validate app name
    const nameValidation = validateAppName(parsed.appName);
    if (!nameValidation.valid) {
      console.error(pc.red(`Error: ${nameValidation.error}`));
      process.exit(1);
    }

    context = {
      appName: parsed.appName,
      template: parsed.from,
      dryRun: parsed.dryRun,
      skipInstall: parsed.skipInstall,
      promptAnswers: {},
    };
  }

  const { appName, template, dryRun, skipInstall } = context;
  const templateConfig = TEMPLATES[template];
  const appPath = path.join(APPS_DIR, appName);
  currentAppPath = appPath;

  // Check if app already exists
  if (fs.existsSync(appPath)) {
    console.error(pc.red(`Error: App "${appName}" already exists at ${appPath}`));
    process.exit(1);
  }

  // Check if template source exists
  if (!fs.existsSync(templateConfig.source)) {
    console.error(pc.red(`Error: Template source not found at ${templateConfig.source}`));
    console.error(pc.dim('Make sure templates have been set up correctly'));
    process.exit(1);
  }

  // Dry run mode
  if (dryRun) {
    printDryRun(context);
    process.exit(0);
  }

  // Start creation
  console.log(`\n${pc.bold('Creating')} ${pc.cyan(appName)} ${pc.bold('from')} ${pc.cyan(template)} ${pc.bold('template...')}\n`);

  try {
    // 1. Copy template
    const copySpinner = ora('Copying template files...').start();
    currentSpinner = copySpinner;

    const fileCount = copyDirectory(templateConfig.source, appPath, templateConfig.exclude);
    rollbackState.appFolderCreated = true;

    copySpinner.succeed(`Copied ${fileCount} files`);

    // 2. Update JSON files
    const jsonSpinner = ora('Updating configuration files...').start();
    currentSpinner = jsonSpinner;

    for (const [file, updates] of Object.entries(templateConfig.jsonUpdates)) {
      const filePath = path.join(appPath, file);
      updateJsonFile(filePath, updates, appName, context.promptAnswers);
    }

    jsonSpinner.succeed('Updated configuration files');

    // 3. Text replacements
    const textSpinner = ora('Updating text files...').start();
    currentSpinner = textSpinner;

    for (const [file, replacements] of Object.entries(templateConfig.textReplacements)) {
      const filePath = path.join(appPath, file);
      replaceInTextFile(filePath, replacements, appName);
    }

    textSpinner.succeed('Updated text files');

    // 4. Desktop port allocation (if applicable)
    if (template === 'desktop') {
      const portSpinner = ora('Allocating ports...').start();
      currentSpinner = portSpinner;

      const ports = allocateDesktopPorts();
      updateDesktopForgeConfig(appPath, ports);

      portSpinner.succeed(`Allocated ports: ${ports.port}, ${ports.loggerPort}`);
    }

    // 5. Update root package.json
    const rootSpinner = ora('Updating root package.json...').start();
    currentSpinner = rootSpinner;

    rollbackState.rootPackageJsonBackup = updateRootPackageJson(appName);

    rootSpinner.succeed('Updated root package.json');

    // 6. Run pnpm install
    if (!skipInstall) {
      const installSpinner = ora('Running pnpm install...').start();
      currentSpinner = installSpinner;

      try {
        execSync('pnpm install', {
          cwd: ROOT_DIR,
          stdio: ['ignore', 'ignore', 'ignore'],
        });
        installSpinner.succeed('Installed dependencies');
      } catch {
        installSpinner.warn('pnpm install completed with warnings');
        // Don't rollback on install failure, just warn
      }

      // 7. Run verification
      const verificationPassed = await runVerification(appName, appPath, template);

      if (!verificationPassed) {
        console.error(pc.red('\nVerification failed. Rolling back...'));
        await rollback(rollbackState, appPath);
        process.exit(1);
      }
    } else {
      console.log(pc.yellow('\nSkipped: pnpm install (use --skip-install was set)'));
      console.log(pc.yellow('Skipped: Verification (lint, build)'));
      console.log(pc.dim('Run "pnpm install" manually, then "pnpm ' + appName + ' lint" and "pnpm ' + appName + ' build"'));
    }

    currentSpinner = null;

    // Print next steps
    printNextSteps(appName, template);
  } catch (error) {
    currentSpinner?.fail('An error occurred');
    currentSpinner = null;

    console.error(pc.red('\nError:'), error instanceof Error ? error.message : error);

    // Attempt rollback
    if (rollbackState.appFolderCreated || rollbackState.rootPackageJsonBackup) {
      await rollback(rollbackState, appPath);
    }

    process.exit(1);
  }
}

// =============================================================================
// Ctrl+C Handler
// =============================================================================

process.on('SIGINT', async () => {
  console.log(pc.yellow('\n\nInterrupted. Cleaning up...'));

  currentSpinner?.stop();

  if (rollbackState.appFolderCreated || rollbackState.rootPackageJsonBackup) {
    await rollback(rollbackState, currentAppPath);
  }

  process.exit(130);
});

// =============================================================================
// Entry Point
// =============================================================================

main().catch((error) => {
  console.error(pc.red('Unexpected error:'), error);
  process.exit(1);
});
