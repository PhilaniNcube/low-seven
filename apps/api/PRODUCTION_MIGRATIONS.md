# Production Migration Guide

## For Production Deployment (Vercel)

### 1. Set Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

```env
TURSO_DATABASE_URL=libsql://your-prod-db.turso.io
TURSO_AUTH_TOKEN=your_prod_token
BETTER_AUTH_SECRET=your_production_secret
BETTERAUTH_URL=https://your-api-domain.vercel.app
CORS_ORIGINS=https://your-web-domain.vercel.app
```

### 2. Run Migrations

You have **two options** to run migrations on your production database:

#### Option A: Using the Migration Script (Recommended)

From your local machine with production credentials:

```bash
# Temporarily set production environment variables
export TURSO_DATABASE_URL="libsql://your-prod-db.turso.io"
export TURSO_AUTH_TOKEN="your_prod_token"

# Run migrations
cd apps/api
bun run db:migrate
```

#### Option B: Using Turso CLI

If you have Turso CLI installed:

```bash
# Show your production database
turso db list

# Apply migrations directly
turso db shell your-prod-db < drizzle/migrations/0000_right_paladin.sql
turso db shell your-prod-db < drizzle/migrations/0001_fancy_angel.sql
```

### 3. Creating New Migrations

When you need to add new migrations:

1. **Generate the migration:**
   ```bash
   cd apps/api
   bun run db:generate:migration
   ```

2. **Test locally first:**
   ```bash
   bun run db:migrate
   ```

3. **Apply to production:**
   Use Option A or B above with production credentials

### 4. Vercel Deployment Notes

⚠️ **Important:** Vercel deployments are **stateless**. Do NOT try to run migrations automatically during build/deploy.

**Why?**
- Multiple build instances might run migrations simultaneously
- Could cause race conditions and data corruption
- Migrations should be run once, manually, before deployment

**Best Practice:**
1. Run migrations manually (Option A or B)
2. Verify migrations succeeded
3. Then deploy your application

### 5. Setting Up Production Database

If you haven't created your production database yet:

```bash
# Create production database
turso db create low-seven-prod

# Get credentials
turso db show low-seven-prod --url
turso db tokens create low-seven-prod

# Add to Vercel environment variables
# Then run migrations using Option A
```

### 6. Troubleshooting

**401 Unauthorized Error:**
- Check that `TURSO_AUTH_TOKEN` is set correctly
- Verify token hasn't expired
- Regenerate token: `turso db tokens create your-db-name`

**Migration Already Applied:**
- Drizzle tracks migrations in `__drizzle_migrations` table
- Safe to run `bun run db:migrate` multiple times
- It will skip already applied migrations

**Connection Timeout:**
- Check database URL is correct
- Verify network/firewall settings
- Try pinging: `turso db shell your-db-name "SELECT 1"`
