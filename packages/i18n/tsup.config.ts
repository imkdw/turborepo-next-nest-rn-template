import { defineEsmConfig } from '@repo/typescript-config/tsup/esm';

export default defineEsmConfig({
  entry: ['src/index.ts', 'src/config.ts'],
});
