# Vercel Deployment Configuration Guide

This guide explains how to configure environment variables for your Low Seven Tours application deployed on Vercel.

## Overview

Your application consists of two separate deployments:
- **Web App** (Next.js) - Frontend application
- **API** (Hono) - Backend API

Both need proper environment variables configured to communicate with each other and work correctly in production.

## 🌐 Web App Configuration (Next.js)

### Environment Variables

Go to your Web App project settings in Vercel → Environment Variables and add:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | URL of your deployed API | `https://your-api-project.vercel.app` |

**Important Notes:**
- ⚠️ **Do NOT include a trailing slash** (e.g., use `https://api.example.com` not `https://api.example.com/`)
- ✅ The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser
- 🔄 After adding/updating variables, you must **redeploy** for changes to take effect

### How to Set Environment Variables in Vercel:

1. Go to your project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter the variable name and value
5. Select which environments it applies to (Production, Preview, Development)
6. Click **Save**

## 🔧 API Configuration (Hono)

### Environment Variables

Go to your API project settings in Vercel → Environment Variables and add:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `CORS_ORIGINS` | Allowed origins for CORS (comma-separated) | `https://your-web-app.vercel.app,https://www.yourdomain.com` |
| `TRUSTED_ORIGINS` | Trusted origins for Better Auth (comma-separated) | `https://your-web-app.vercel.app,https://www.yourdomain.com` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@host:5432/database` |

**Important Notes:**
- ⚠️ **Include ALL production URLs** where your web app will be accessed from
- ✅ If you have multiple domains (e.g., preview deployments), include them all
- 🔐 Keep `DATABASE_URL` and other sensitive values secure
- 🔄 After adding/updating variables, you must **redeploy** for changes to take effect

### Example Configuration:

```env
# API Environment Variables
CORS_ORIGINS=https://low-seven.vercel.app,https://www.low7.tours
TRUSTED_ORIGINS=https://low-seven.vercel.app,https://www.low7.tours
DATABASE_URL=postgresql://username:password@hostname.com:5432/dbname
```

## 🔍 Troubleshooting Common Issues

### Issue: "Connection timeout" or fetch stays in pending state

**Possible Causes:**
1. ❌ `NEXT_PUBLIC_API_URL` not set or incorrect
2. ❌ API URL has trailing slash
3. ❌ CORS_ORIGINS doesn't include your web app URL
4. ❌ Changes made but deployment not triggered

**Solutions:**
- Verify all environment variables are set correctly
- Ensure URLs don't have trailing slashes
- Trigger a new deployment after updating variables
- Check browser console for CORS errors

### Issue: CORS errors in browser console

**Possible Causes:**
1. ❌ Web app URL not in `CORS_ORIGINS`
2. ❌ Web app URL not in `TRUSTED_ORIGINS`
3. ❌ Environment variables have trailing slashes

**Solutions:**
```env
# Make sure both are set in API project
CORS_ORIGINS=https://your-exact-web-url.vercel.app
TRUSTED_ORIGINS=https://your-exact-web-url.vercel.app
```

### Issue: Authentication fails or redirects incorrectly

**Possible Causes:**
1. ❌ `TRUSTED_ORIGINS` not set in API
2. ❌ URLs don't match exactly (http vs https, www vs non-www)

**Solutions:**
- Ensure `TRUSTED_ORIGINS` includes exact URL user sees in browser
- Include all variations (with/without www) if applicable

### Issue: "Signal timeout" or "Request timeout" errors (No CORS errors)

This typically indicates the API is reachable but taking too long to respond, often due to database connection issues in serverless environments.

**Possible Causes:**
1. ❌ Database connection timing out
2. ❌ Cold start taking too long
3. ❌ `DATABASE_URL` not set or incorrect
4. ❌ Database not accessible from Vercel (IP restrictions, network issues)

**Solutions:**

1. **Check Database URL**: Verify `DATABASE_URL` is set correctly in API environment variables
   ```env
   # Should look like this (for Neon)
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

2. **Check Vercel Function Logs**:
   - Go to your API project in Vercel
   - Click on "Deployments" → Select latest deployment
   - Click "Functions" → View function logs
   - Look for database connection errors or timeout messages

3. **Verify Database Provider Settings**:
   - For Neon: Ensure "Enable connection pooling" is enabled
   - Check if there are IP restrictions blocking Vercel
   - Verify SSL mode is correct (`?sslmode=require` for Neon)

4. **Test Database Connection**:
   Add a simple health check endpoint to test:
   ```typescript
   // In apps/api/src/index.ts
   app.get("/api/health", async (c) => {
     try {
       await db.execute(sql`SELECT 1`);
       return c.json({ status: "ok", database: "connected" });
     } catch (error) {
       return c.json({ 
         status: "error", 
         database: "failed",
         error: error.message 
       }, 500);
     }
   });
   ```

5. **Check for Missing Dependencies**:
   - Ensure `ws` package is installed: `bun add ws`
   - Ensure `@types/ws` is installed: `bun add -d @types/ws`
   - These are required for Neon's WebSocket connections in serverless

6. **Increase Function Timeout** (if on paid plan):
   - Go to API project → Settings → Functions
   - Increase "Max Duration" to 15-20 seconds
   - Note: Free tier is limited to 10 seconds

**Quick Check Commands:**
```bash
# Test API health endpoint
curl https://your-api-url.vercel.app/api/health

# Test auth endpoint
curl https://your-api-url.vercel.app/api/auth/reference
```
- Ensure `TRUSTED_ORIGINS` includes exact URL user sees in browser
- Include all variations (with/without www) if applicable

## 📝 Setup Checklist

### Web App Setup:
- [*] `NEXT_PUBLIC_API_URL` is set
- [*] URL points to correct API deployment
- [*] No trailing slash in URL
- [ ] Redeployed after setting variable

### API Setup:
- [*] `CORS_ORIGINS` includes web app URL(s)
- [*] `TRUSTED_ORIGINS` includes web app URL(s)
- [*] `DATABASE_URL` is set correctly
- [*] No trailing slashes in origin URLs
- [*] Redeployed after setting variables

### Testing:
- [ ] Sign in works without timeout
- [ ] No CORS errors in browser console
- [ ] Network tab shows successful API calls
- [ ] Authentication persists across pages

## 🚀 Deployment Workflow

1. **Update environment variables** in Vercel dashboard
2. **Trigger new deployment** or commit changes to trigger automatic deployment
3. **Wait for deployment** to complete
4. **Test the application** thoroughly
5. **Check browser console** for any errors

## 🔐 Security Best Practices

- ✅ Never commit environment variables to Git
- ✅ Use different values for Production vs Preview environments
- ✅ Regularly rotate sensitive credentials
- ✅ Only include necessary origins in CORS_ORIGINS
- ✅ Monitor Vercel logs for unauthorized access attempts

## 📚 Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/projects/environment-variables)
- [Better Auth CORS Configuration](https://www.better-auth.com/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 💡 Local Development

For local development, create `.env.local` files:

**apps/web/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**apps/api/.env:**
```env
CORS_ORIGINS=http://localhost:3001,http://localhost:3000
TRUSTED_ORIGINS=http://localhost:3001,http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/low_seven
```

**Note:** These files are gitignored and won't be committed to version control.
