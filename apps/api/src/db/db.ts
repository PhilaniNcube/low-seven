import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

console.log("[Database] Configuring Turso connection...");
console.log("[Database] Has TURSO_DATABASE_URL:", !!process.env.TURSO_DATABASE_URL);
console.log("[Database] Has TURSO_AUTH_TOKEN:", !!process.env.TURSO_AUTH_TOKEN);

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is required");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN is required");
}

// Create Turso client - optimized for edge/serverless
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema, casing: 'snake_case' });

console.log("[Database] Turso database configured successfully");
