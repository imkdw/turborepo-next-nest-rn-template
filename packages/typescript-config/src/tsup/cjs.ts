import type { Options } from 'tsup';
import { baseConfig } from './base';

/**
 * CJS only 빌드 프리셋 (서버 전용 패키지용)
 * 사용처: @repo/server-shared (NestJS)
 */
export const cjsPreset: Partial<Options> = {
  ...baseConfig,
  format: ['cjs'],
};

export function defineCjsConfig(options: Partial<Options> = {}): Options {
  return {
    entry: ['src/index.ts'],
    ...cjsPreset,
    ...options,
  } as Options;
}
