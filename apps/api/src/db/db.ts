import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';
import ws from 'ws';

// Configure WebSocket for serverless (Node.js environments)
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// For serverless environments (Vercel), use Neon's serverless driver
// It's optimized for edge/serverless with WebSockets
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Serverless-friendly settings
  connectionTimeoutMillis: 5000, // 5 seconds connection timeout
  idleTimeoutMillis: 30000, // 30 seconds idle timeout
  max: 1, // Limit connections in serverless
});

export const db = drizzle(pool, { schema, casing: 'snake_case' });