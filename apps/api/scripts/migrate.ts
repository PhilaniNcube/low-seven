import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";

console.log("🚀 Running database migrations...");
console.log("Database URL:", process.env.TURSO_DATABASE_URL);

if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
  console.error("❌ Missing required environment variables:");
  console.error("  - TURSO_DATABASE_URL");
  console.error("  - TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function runMigrations() {
  try {
    console.log("📦 Applying migrations from ./drizzle/migrations...");
    await migrate(db, { migrationsFolder: "./drizzle/migrations" });
    console.log("✅ Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:");
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
