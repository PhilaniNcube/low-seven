# Turso Database Setup

## What Changed

We've switched from Neon PostgreSQL to Turso SQLite because:
- ✅ **Better Vercel compatibility** - No WebSocket issues
- ✅ **Lower latency** - Edge-optimized database
- ✅ **No connection pooling issues** - HTTP-based
- ✅ **Free tier** - 500MB databases, 1 billion row reads/month

## Setup Instructions

### 1. Install Turso CLI

**Mac/Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Windows:**
```powershell
powershell -c "irm https://get.tur.so/install.ps1 | iex"
```

### 2. Sign Up / Login

```bash
turso auth signup
# or
turso auth login
```

### 3. Create Database

```bash
turso db create low-seven-db
```

### 4. Get Database Credentials

```bash
# Get database URL
turso db show low-seven-db --url

# Create auth token
turso db tokens create low-seven-db
```

### 5. Set Environment Variables

**Locally** (apps/api/.env):
```env
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your_token_here
```

**Vercel** (API Project → Settings → Environment Variables):
- Add `TURSO_DATABASE_URL`: `libsql://your-db-name.turso.io`
- Add `TURSO_AUTH_TOKEN`: `your_token_here`

### 6. Run Migrations

**Locally:**
```bash
cd apps/api
bun run db:migrate
```

**Or use Turso CLI:**
```bash
turso db shell low-seven-db < drizzle/migrations/0000_right_paladin.sql
```

### 7. Verify Setup

Test the database connection:
```bash
turso db shell low-seven-db
```

Then run:
```sql
.tables
```

You should see all your tables listed.

## Redeploy

After setting environment variables in Vercel:
1. Go to Vercel Dashboard → API Project → Deployments
2. Redeploy the latest deployment
3. Test sign-in - it should work now!

## Troubleshooting

**If sign-in still fails with timeouts:**

1. **Check database region** - The database might be too far from Vercel servers:
```bash
turso db show low-seven-db
```
Look for the "Location" field. If it's not close to your Vercel region (typically `us-east`), create a replica:

```bash
# List available regions
turso db regions

# Create a replica in a region closer to Vercel (e.g., us-east)
turso db replicate low-seven-db --region iad  # iad = us-east (Virginia)
```

2. **Verify environment variables** in Vercel:
   - Check `TURSO_DATABASE_URL` is set correctly
   - Check `TURSO_AUTH_TOKEN` is valid
   - Ensure variables are set for Production environment

3. **Check Vercel logs** for detailed error messages:
   - Look for `[Auth Handler]` and `[Database]` messages
   - Check if timeout is before or after database connection

4. **Verify migrations ran successfully:**
```bash
turso db shell low-seven-db

# Then run:
.tables
```

**If still having issues:**
1. Verify database URL starts with `libsql://`
2. Regenerate auth token if it's expired
3. Check Vercel function logs for specific errors

**Useful Turso Commands:**
```bash
# List databases
turso db list

# Open database shell
turso db shell low-seven-db

# Show database info
turso db show low-seven-db

# Destroy database (careful!)
turso db destroy low-seven-db
```

## Migration from Neon

If you had data in Neon, you'll need to:
1. Export data from Neon
2. Convert to SQLite format
3. Import into Turso

Or start fresh since this is development.

## Next Steps

1. Set up Turso database
2. Add environment variables to Vercel
3. Redeploy API
4. Test sign-in - should work without timeouts! 🎉
