import { z, ZodError } from 'zod';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(9999),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]),
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().optional(),
}).refine((input) => {
  if (input.NODE_ENV === 'production') {
    return !!input.DATABASE_AUTH_TOKEN;
  }
  return true;
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line import/no-mutable-exports, ts/no-redeclare
let env: env;

try {
  // eslint-disable-next-line node/no process-env
  env = EnvSchema.parse(process.env);

} catch (e) {
  const error = e as ZodError;
  console.error('❌ Invalid env:');
  console.error(error.flatten().fieldErrors);
  process.exit(1);
}

export default env;