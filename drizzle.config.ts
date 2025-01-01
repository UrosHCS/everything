import { loadEnvConfig } from '@next/env';
import type { Config } from 'drizzle-kit';

const { combinedEnv } = loadEnvConfig(process.cwd());

if (!combinedEnv.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not set');
}

export default {
  dialect: 'postgresql',
  schema: './src/backend/drizzle/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: combinedEnv.POSTGRES_URL,
  },
  migrations: {
    table: 'migrations',
  },
} satisfies Config;
