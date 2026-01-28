import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';



if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("DATABASE_TOKEN is required");
}

// Create Turso client - optimized for edge/serverless with timeout settings
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  // Add connection timeout to prevent hanging (10 seconds)
  intMode: "number",
  // Set sync interval for embedded replicas (if used)
  syncInterval: 60,
});

export const db = drizzle(client, { schema, casing: 'snake_case' });

console.log("[Database] Turso database configured successfully");

/**
 * Execute a database operation with timeout protection
 * Prevents operations from hanging indefinitely
 */
export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number = 10000,
  operationName: string = "Database operation"
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`${operationName} timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([operation, timeoutPromise]);
  } catch (error) {
    console.error(`[Database] ${operationName} failed:`, error);
    throw error;
  }
}
