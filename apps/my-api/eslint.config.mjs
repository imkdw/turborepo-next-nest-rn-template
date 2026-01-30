import { nestjsConfig } from '@repo/eslint-config/nestjs';

export default [
  ...nestjsConfig,
  {
    ignores: ['eslint.config.mjs', 'dist/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
