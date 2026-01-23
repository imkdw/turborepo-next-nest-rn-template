import type { Options } from 'tsup';

/**
 * 모든 tsup 설정의 기본값
 */
export const baseConfig: Partial<Options> = {
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
};
