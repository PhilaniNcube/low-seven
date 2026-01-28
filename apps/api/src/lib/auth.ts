import { db } from "../db/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import type { Context } from "hono";
import { adminUser } from "../db/schema";
import { and, eq } from "drizzle-orm";

const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(",") || [
  "http://localhost:3001",
  "http://localhost:3000",
];

console.log("[Auth] Initializing with trusted origins:", trustedOrigins);

if (!process.env.DATABASE_URL) {
  console.error("[Auth] DATABASE_URL is not set!");
} else {
  console.log("[Auth] DATABASE_URL is set");
}

if (!process.env.BETTER_AUTH_SECRET) {
  console.warn("[Auth] BETTER_AUTH_SECRET is not set! Using fallback for development.");
} else {
  console.log("[Auth] BETTER_AUTH_SECRET is set");
}

if (!process.env.BETTERAUTH_URL) {
  console.warn("[Auth] BETTERAUTH_URL is not set! This is required for production.");
} else {
  console.log("[Auth] BETTERAUTH_URL is set to:", process.env.BETTERAUTH_URL);
}

console.log("[Auth] Creating Better Auth instance...");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-for-development-only-change-in-production",
  baseURL: process.env.BETTERAUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  trustedOrigins,
  plugins: [openAPI()],
});

console.log("[Auth] Better Auth instance created successfully");

/**
 * Check if a user is an active admin
 * @param userId - The user ID to check
 * @returns true if user is an active admin, false otherwise
 */
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const admin = await db.query.adminUser.findFirst({
    where: and(eq(adminUser.userId, userId), eq(adminUser.isActive, true)),
  });

  return !!admin;
};

/**
 * Middleware to authenticate and authorize admin users
 * Usage: app.get('/admin/route', requireAdmin, (c) => { ... })
 */
export const requireAdmin = async (c: Context, next: () => Promise<void>) => {
  try {
    // Get session from the request
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    console.log("Session in requireAdmin middleware:", session);

    // Check if user is authenticated
    if (!session || !session.user) {
      return c.json({ error: "Unauthorized - Please login" }, 401);
    }

    // Check if user is an active admin
    const isAdmin = await isUserAdmin(session.user.id);

    if (!isAdmin) {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }

    // Fetch admin details for context
    const admin = await db.query.adminUser.findFirst({
      where: eq(adminUser.userId, session.user.id),
    });

    // Attach user and admin info to context for use in route handlers
    c.set("user", session.user);
    c.set("admin", admin);

    await next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return c.json(
      { error: "Internal server error during authentication" },
      500,
    );
  }
};

/**
 * Middleware to check for specific admin roles
 * Usage: app.get('/super-admin/route', requireAdminRole(['super_admin']), (c) => { ... })
 */
export const requireAdminRole = (allowedRoles: string[]) => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      // Get session from the request
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      // Check if user is authenticated
      if (!session || !session.user) {
        return c.json({ error: "Unauthorized - Please login" }, 401);
      }

      // Check if user is an active admin
      const isAdmin = await isUserAdmin(session.user.id);

      if (!isAdmin) {
        return c.json({ error: "Forbidden - Admin access required" }, 403);
      }

      // Fetch admin details for role checking
      const admin = await db.query.adminUser.findFirst({
        where: eq(adminUser.userId, session.user.id),
      });

      // Check if admin has the required role
      if (!admin || !allowedRoles.includes(admin.role)) {
        return c.json(
          {
            error: `Forbidden - Requires one of the following roles: ${allowedRoles.join(", ")}`,
          },
          403,
        );
      }

      // Attach user and admin info to context
      c.set("user", session.user);
      c.set("admin", admin);

      await next();
    } catch (error) {
      console.error("Admin role authentication error:", error);
      return c.json(
        { error: "Internal server error during authentication" },
        500,
      );
    }
  };
};

/**
 * Middleware to authenticate regular users (non-admin)
 * Usage: app.get('/protected/route', requireAuth, (c) => { ... })
 */
export const requireAuth = async (c: Context, next: () => Promise<void>) => {
  try {
    // Get session from the request
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    // Check if user is authenticated
    if (!session || !session.user) {
      return c.json({ error: "Unauthorized - Please login" }, 401);
    }

    // Attach user info to context
    c.set("user", session.user);

    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json(
      { error: "Internal server error during authentication" },
      500,
    );
  }
};
