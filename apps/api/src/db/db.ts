import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

// For serverless environments (Vercel), use Neon's serverless driver
// It's optimized for edge/serverless with WebSockets
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema, casing: 'snake_case' });