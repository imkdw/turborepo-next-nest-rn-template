import type { Options } from 'tsup';
import { baseConfig } from './base';

export const esmPreset: Partial<Options> = {
  ...baseConfig,
  format: ['esm'],
  splitting: true,
};

export function defineEsmConfig(options: Partial<Options> = {}): Options {
  return {
    entry: ['src/index.ts'],
    ...esmPreset,
    ...options,
  } as Options;
}
