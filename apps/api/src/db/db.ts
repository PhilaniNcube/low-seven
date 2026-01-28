import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import ws from 'ws';

// Configure WebSocket for serverless (Node.js environments)
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

console.log("[Database] Configuring connection pool...");
console.log("[Database] Has DATABASE_URL:", !!process.env.DATABASE_URL);

// For serverless environments (Vercel), use Neon's serverless driver
// It's optimized for edge/serverless with WebSockets
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Serverless-friendly settings
  connectionTimeoutMillis: 10000, // 10 seconds connection timeout (increased from 5)
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  max: 1, // Limit connections in serverless
});

pool.on('error', (err) => {
  console.error('[Database] Unexpected pool error:', err);
});

pool.on('connect', () => {
  console.log('[Database] Client connected to pool');
});

console.log("[Database] Pool configured successfully");

export const db = drizzle(pool, { schema, casing: 'snake_case' });