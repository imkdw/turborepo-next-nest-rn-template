import { defineDualConfig } from '@repo/typescript-config/tsup/dual';

export default defineDualConfig({
  entry: {
    index: 'src/index.ts',
    'client/index': 'src/client/index.ts',
    'server/index': 'src/server/index.ts',
  },
});
