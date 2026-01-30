import type { Config } from 'jest';
import baseConfig from '../../jest.config';

const e2eConfig: Config = {
  ...baseConfig,
  rootDir: '../..',
  testMatch: ['<rootDir>/test/e2e/**/*.spec-e2e.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/e2e/setup.ts'],
  testTimeout: 30000,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@test/(.*)$': '<rootDir>/test/$1',
    '^@repo/server-shared$': '<rootDir>/../../packages/server-shared/src',
    '^@repo/(.*)$': '<rootDir>/../../packages/shared/$1/src',
  },
};

export default e2eConfig;
