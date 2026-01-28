import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

console.log("[Database] Configuring connection...");
console.log("[Database] Has DATABASE_URL:", !!process.env.DATABASE_URL);
console.log("[Database] Using Neon HTTP driver for Vercel compatibility");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Use Neon HTTP driver - more reliable on Vercel than WebSocket
const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema, casing: 'snake_case' });

console.log("[Database] Database configured with HTTP driver");
