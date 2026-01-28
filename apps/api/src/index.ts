import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import activitiesRoute from "./routes/activities";
import packagesRoute from "./routes/packages";
import bookingsRoute from "./routes/bookings";
import paymentsRoute from "./routes/payments";
import reviewsRoute from "./routes/reviews";
import guidesRoute from "./routes/guides";
import { db } from "./db/db";
import { sql } from "drizzle-orm";

const app = new Hono();

// CORS middleware - must be before routes
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [
  "http://localhost:3001",
  "http://localhost:3000"
];

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

// Health check endpoint - no auth required
app.get("/api/health", async (c) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    await db.run(sql`SELECT 1`);
    const dbResponseTime = Date.now() - startTime;
    
    return c.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "connected",
        responseTime: `${dbResponseTime}ms`
      },
      environment: {
        hasDbUrl: !!process.env.TURSO_DATABASE_URL,
        hasCorsOrigins: !!process.env.CORS_ORIGINS,
        hasTrustedOrigins: !!process.env.TRUSTED_ORIGINS,
        corsOrigins: process.env.CORS_ORIGINS?.split(",").length || 0,
        trustedOrigins: process.env.TRUSTED_ORIGINS?.split(",").length || 0,
      }
    });
  } catch (error) {
    const dbResponseTime = Date.now() - startTime;
    console.error("[Health Check] Database error:", error);
    
    return c.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        status: "error",
        responseTime: `${dbResponseTime}ms`,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      environment: {
        hasDbUrl: !!process.env.TURSO_DATABASE_URL,
        hasCorsOrigins: !!process.env.CORS_ORIGINS,
        hasTrustedOrigins: !!process.env.TRUSTED_ORIGINS,
      }
    }, 500);
  }
});

// Debug endpoint to check environment variables (REMOVE IN PRODUCTION!)
app.get("/api/debug/env", async (c) => {
  return c.json({
    corsOrigins: {
      raw: process.env.CORS_ORIGINS,
      parsed: process.env.CORS_ORIGINS?.split(",") || [],
      count: process.env.CORS_ORIGINS?.split(",").length || 0,
    },
    trustedOrigins: {
      raw: process.env.TRUSTED_ORIGINS,
      parsed: process.env.TRUSTED_ORIGINS?.split(",") || [],
      count: process.env.TRUSTED_ORIGINS?.split(",").length || 0,
    },
    hasDbUrl: !!process.env.TURSO_DATABASE_URL,
    requestOrigin: c.req.header("origin") || "no origin header",
    allowedInCors: allowedOrigins,
  });
});

app
  .all("/api/auth/*", async (c) => {
    const requestStart = Date.now();
    console.log("[Auth Handler] Incoming request:", {
      method: c.req.method,
      path: c.req.path,
      origin: c.req.header("origin"),
      contentType: c.req.header("content-type"),
    });
    
    try {
      // Skip DB test for auth routes - Better Auth will handle DB connections
      // Testing DB connection here can add unnecessary latency
      
      console.log("[Auth Handler] Calling auth.handler...");
      const authStartTime = Date.now();
      
      // Add timeout to prevent hanging (10s to match Vercel's default, but request 30s in config)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.error("[Auth Handler] Handler exceeded 10 second timeout");
        console.error("[Auth Handler] This may indicate database connectivity issues");
        console.error("[Auth Handler] Request details:", {
          method: c.req.method,
          path: c.req.path,
          timeElapsed: `${Date.now() - requestStart}ms`,
        });
        controller.abort();
      }, 10000);
      
      const timeoutPromise = new Promise<Response>((_, reject) => {
        controller.signal.addEventListener('abort', () => {
          reject(new Error("Auth handler timeout after 10 seconds"));
        });
      });
      
      const handlerPromise = auth.handler(c.req.raw).finally(() => clearTimeout(timeoutId));
      
      const response = await Promise.race([handlerPromise, timeoutPromise]);
      
      const authDuration = Date.now() - authStartTime;
      const totalDuration = Date.now() - requestStart;
      console.log(`[Auth Handler] Handler completed in ${authDuration}ms (total: ${totalDuration}ms)`);
      
      console.log("[Auth Handler] Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      
      // Clone to log body
      const cloned = response.clone();
      cloned.text().then(text => {
        console.log("[Auth Handler] Response body:", text);
      }).catch(err => {
        console.error("[Auth Handler] Error reading response:", err);
      });
      
      // Manually add CORS headers to auth responses since Better Auth bypasses Hono middleware
      const origin = c.req.header("origin");
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      }
      
      return response;
    } catch (error) {
      console.error("[Auth Handler] Error:", error);
      console.error("[Auth Handler] Error stack:", error instanceof Error ? error.stack : 'No stack');
      
      // Check if it's a timeout error
      const isTimeout = error instanceof Error && error.message.includes("timeout");
      
      // Return error response with CORS headers
      const errorResponse = c.json({ 
        error: isTimeout ? "Authentication request timeout" : "Authentication error",
        details: error instanceof Error ? error.message : String(error),
        suggestion: isTimeout 
          ? "Database connection may be slow or unavailable. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
          : "Please try again or contact support if the issue persists."
      }, isTimeout ? 504 : 500); // 504 Gateway Timeout for timeout errors
      
      const origin = c.req.header("origin");
      if (origin && allowedOrigins.includes(origin)) {
        errorResponse.headers.set("Access-Control-Allow-Origin", origin);
        errorResponse.headers.set("Access-Control-Allow-Credentials", "true");
      }
      
      return errorResponse;
    }
  })
  .route("/api/webhooks", paymentsRoute) // Webhook routes (no auth)
  .route("/api/activities", activitiesRoute)
  .route("/api/packages", packagesRoute)
  .route("/api/bookings", bookingsRoute)
  .route("/api/payments", paymentsRoute)
  .route("/api/reviews", reviewsRoute)
  .route("/api/guides", guidesRoute)
  .get("/", (c) => {
    return c.json({
      name: "Low Seven Tours API",
      version: "1.0.0",
      description:
        "API for managing tour activities, packages, bookings, payments, reviews, and guides",
      endpoints: {
        auth: {
          path: "/api/auth/*",
          description: "Authentication endpoints",
          methods: ["GET", "POST"],
        },
        activities: {
          path: "/api/activities",
          description: "Manage tour activities",
          methods: ["GET", "POST", "PUT", "DELETE"],
        },
        packages: {
          path: "/api/packages",
          description: "Manage tour packages",
          methods: ["GET", "POST", "PUT", "DELETE"],
        },
        bookings: {
          path: "/api/bookings",
          description: "Manage customer bookings",
          methods: ["GET", "POST", "PUT", "DELETE"],
        },
        payments: {
          path: "/api/payments",
          description: "Process payments and manage transactions",
          methods: ["GET", "POST"],
        },
        reviews: {
          path: "/api/reviews",
          description: "Manage customer reviews",
          methods: ["GET", "POST", "PUT", "DELETE"],
        },
        guides: {
          path: "/api/guides",
          description: "Manage tour guides",
          methods: ["GET", "POST", "PUT", "DELETE"],
        },
        webhooks: {
          path: "/api/webhooks",
          description: "Webhook endpoints for external integrations",
          methods: ["POST"],
        },
      },
      documentation: "Visit the respective endpoints for detailed information",
      status: "online",
    });
  });

export default app;
