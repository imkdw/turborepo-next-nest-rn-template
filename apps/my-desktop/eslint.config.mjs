import { config as baseConfig } from '@repo/eslint-config/base';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  // Config files without type checking
  {
    files: [
      'eslint.config.mjs',
      'forge.config.ts',
      'postcss.config.js',
      'tailwind.config.ts',
      'webpack.*.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
    rules: {
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Allow require in Electron main process
  {
    files: ['src/index.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    ignores: ['out/**', '.webpack/**', 'node_modules/**'],
  },
);
