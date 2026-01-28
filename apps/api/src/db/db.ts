import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import ws from 'ws';

console.log("[Database] Configuring connection...");
console.log("[Database] Has DATABASE_URL:", !!process.env.DATABASE_URL);
console.log("[Database] Environment:", process.env.VERCEL ? 'Vercel' : 'Local');

// Configure WebSocket for serverless (Node.js environments)
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// CRITICAL: Disable pipelining for Vercel - this often causes hangs
neonConfig.pipelineConnect = false;
neonConfig.pipelineTLS = false;

// Increase fetch timeout for Vercel cold starts
neonConfig.fetchConnectionCache = true;

console.log("[Database] Neon config set - pipelining disabled for Vercel compatibility");

// For serverless environments (Vercel), use Neon's serverless driver
// It's optimized for edge/serverless with WebSockets
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Serverless-friendly settings
  connectionTimeoutMillis: 15000, // 15 seconds connection timeout (increased for Vercel)
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  max: 1, // Limit connections in serverless
});

pool.on('error', (err: Error) => {
  console.error('[Database] Unexpected pool error:', err);
});

pool.on('connect', () => {
  console.log('[Database] Client connected to pool');
});

console.log("[Database] Pool configured successfully");

export const db = drizzle(pool, { schema, casing: 'snake_case' });