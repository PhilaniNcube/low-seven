import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';



if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("DATABASE_TOKEN is required");
}

// Create Turso client - optimized for edge/serverless
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema, casing: 'snake_case' });

console.log("[Database] Turso database configured successfully");
