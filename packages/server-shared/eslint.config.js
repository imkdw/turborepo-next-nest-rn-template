import { nestjsConfig } from '@repo/eslint-config/nestjs';

export default [
  ...nestjsConfig,
  {
    ignores: ['eslint.config.js', 'dist/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-console': 'error',
    },
  },
];
