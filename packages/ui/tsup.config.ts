import { defineEsmConfig } from '@repo/typescript-config/tsup/esm';

export default defineEsmConfig({
  entry: ['src/index.ts', 'src/tokens/tailwind-preset.ts'],
  external: ['react', 'react-dom'],
});
