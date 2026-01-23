import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/tsup/base.ts',
    'src/tsup/cjs.ts',
    'src/tsup/esm.ts',
    'src/tsup/dual.ts',
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist/tsup',
  splitting: true,
});
