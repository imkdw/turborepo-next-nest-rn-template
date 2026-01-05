export const APP_ENV = {
  TEST: 'test',
  LOCAL: 'local',
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
} as const;

export type AppEnv = (typeof APP_ENV)[keyof typeof APP_ENV];
