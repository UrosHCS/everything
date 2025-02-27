import * as schema from './schema';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const db = drizzle(sql, {
  schema,
  casing: 'camelCase',
  logger: false,
});
