import type { Options } from 'tsup';
import { baseConfig } from './base';

/**
 * CJS + ESM 듀얼 빌드 프리셋 (공용 패키지용)
 * 사용처: @repo/consts, @repo/exception, @repo/utils
 */
export const dualPreset: Partial<Options> = {
  ...baseConfig,
  format: ['cjs', 'esm'],
};

export function defineDualConfig(options: Partial<Options> = {}): Options {
  return {
    entry: ['src/index.ts'],
    ...dualPreset,
    ...options,
  } as Options;
}
