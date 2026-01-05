import { APP_ENV } from '@repo/consts';
import { z } from 'zod';

export const myConfigSchema = z.object({
  DATABASE_URL: z.string(),
  API_PORT: z.coerce.number(),
  APP_ENV: z.enum([APP_ENV.TEST, APP_ENV.LOCAL, APP_ENV.DEVELOPMENT, APP_ENV.PRODUCTION]),
});

export type MyConfig = z.infer<typeof myConfigSchema>;
