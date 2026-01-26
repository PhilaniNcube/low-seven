import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  driver: "neon-http",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  casing: "snake_case",
});
