var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/index.ts
import { handle } from "@hono/node-server/vercel";

// src/index.ts
import { Hono as Hono7 } from "hono";
import { cors } from "hono/cors";

// src/db/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  account: () => account,
  accountRelations: () => accountRelations,
  activities: () => activities,
  activitiesRelations: () => activitiesRelations,
  activityMedia: () => activityMedia,
  activityMediaRelations: () => activityMediaRelations,
  adminUser: () => adminUser,
  adminUserRelations: () => adminUserRelations,
  bookingActivities: () => bookingActivities,
  bookingActivitiesRelations: () => bookingActivitiesRelations,
  bookingStatusEnum: () => bookingStatusEnum,
  bookings: () => bookings,
  bookingsRelations: () => bookingsRelations,
  guides: () => guides,
  guidesRelations: () => guidesRelations,
  packageMedia: () => packageMedia,
  packageMediaRelations: () => packageMediaRelations,
  packages: () => packages,
  packagesRelations: () => packagesRelations,
  packagesToActivities: () => packagesToActivities,
  packagesToActivitiesRelations: () => packagesToActivitiesRelations,
  paymentMethodEnum: () => paymentMethodEnum,
  paymentStatusEnum: () => paymentStatusEnum,
  payments: () => payments,
  paymentsRelations: () => paymentsRelations,
  reviews: () => reviews,
  reviewsRelations: () => reviewsRelations,
  session: () => session,
  sessionRelations: () => sessionRelations,
  user: () => user,
  userRelations: () => userRelations,
  verification: () => verification
});
import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp
} from "drizzle-orm/pg-core";
var user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);
var account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);
var verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);
var adminUser = pgTable(
  "admin_user",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
    role: text("role").default("admin").notNull(),
    // e.g., "admin", "super_admin", "moderator"
    permissions: text("permissions"),
    // JSON string for granular permissions
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
  },
  (table) => [
    index("admin_user_userId_idx").on(table.userId),
    index("admin_user_isActive_idx").on(table.isActive)
  ]
);
var userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  bookings: many(bookings),
  reviews: many(reviews),
  adminUser: one(adminUser)
}));
var adminUserRelations = relations(adminUser, ({ one }) => ({
  user: one(user, {
    fields: [adminUser.userId],
    references: [user.id]
  })
}));
var sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  })
}));
var accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}));
var bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed"
]);
var paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "processing",
  "completed",
  "failed",
  "refunded",
  "partially_refunded"
]);
var paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "debit_card",
  "paypal",
  "bank_transfer",
  "cash",
  "other"
]);
var activities = pgTable("activity", {
  id: text("id").primaryKey(),
  // Using text to match your Auth pattern (CUID/UUID)
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  location: text("location").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  // e.g., 120 for 2 hours
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  // Store generic catalog price
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var activityMedia = pgTable("activity_media", {
  id: text("id").primaryKey(),
  activityId: text("activity_id").notNull().references(() => activities.id, { onDelete: "cascade" }),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull(),
  // 'image' or 'video'
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0).notNull(),
  // For ordering media items
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [
  index("activity_media_activityId_idx").on(table.activityId)
]);
var packages = pgTable("package", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  isCustom: boolean("is_custom").default(false).notNull(),
  // distinct bespoke templates
  basePrice: decimal("base_price", { precision: 10, scale: 2 }),
  // Optional base fee
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
});
var packageMedia = pgTable("package_media", {
  id: text("id").primaryKey(),
  packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
  mediaUrl: text("media_url").notNull(),
  mediaType: text("media_type").notNull(),
  // 'image' or 'video'
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0).notNull(),
  // For ordering media items
  createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [
  index("package_media_packageId_idx").on(table.packageId)
]);
var packagesToActivities = pgTable(
  "package_to_activity",
  {
    packageId: text("package_id").notNull().references(() => packages.id, { onDelete: "cascade" }),
    activityId: text("activity_id").notNull().references(() => activities.id, { onDelete: "cascade" })
  },
  (t) => [
    primaryKey({ columns: [t.packageId, t.activityId] })
    // Composite PK
  ]
);
var bookings = pgTable("booking", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  // Link to your existing User
  packageId: text("package_id").references(() => packages.id, { onDelete: "set null" }),
  // Nullable for purely bespoke bookings
  status: bookingStatusEnum("status").default("pending").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [
  index("booking_user_idx").on(table.userId)
]);
var bookingActivities = pgTable("booking_activity", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  activityId: text("activity_id").notNull().references(() => activities.id),
  guideId: text("guide_id").references(() => guides.id, { onDelete: "set null" }),
  // Optional guide assignment
  // We snapshot the price here. If the catalog price changes later, 
  // this historic booking record remains accurate.
  priceAtBooking: decimal("price_at_booking", { precision: 10, scale: 2 }).notNull(),
  scheduledAt: timestamp("scheduled_at")
  // Specific time for this activity
}, (table) => [
  index("booking_activity_guideId_idx").on(table.guideId)
]);
var reviews = pgTable("review", {
  id: text("id").primaryKey(),
  bookingActivityId: text("booking_activity_id").notNull().references(() => bookingActivities.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  // 1-5 stars
  comment: text("comment"),
  isVerified: boolean("is_verified").default(true).notNull(),
  // Verified purchase
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [
  index("review_bookingActivityId_idx").on(table.bookingActivityId),
  index("review_userId_idx").on(table.userId)
]);
var payments = pgTable("payment", {
  id: text("id").primaryKey(),
  bookingId: text("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  // ISO 4217 currency code
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
  transactionId: text("transaction_id"),
  // External payment provider transaction ID
  paymentProvider: text("payment_provider"),
  // e.g., 'stripe', 'paypal', 'square'
  paymentIntentId: text("payment_intent_id"),
  // For providers like Stripe
  metadata: text("metadata"),
  // JSON string for additional payment data
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [
  index("payment_bookingId_idx").on(table.bookingId),
  index("payment_status_idx").on(table.paymentStatus),
  index("payment_transactionId_idx").on(table.transactionId)
]);
var guides = pgTable("guide", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  bio: text("bio"),
  specialties: text("specialties"),
  // Comma-separated or JSON array of specialty areas
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => /* @__PURE__ */ new Date()).notNull()
}, (table) => [
  index("guide_email_idx").on(table.email),
  index("guide_isActive_idx").on(table.isActive)
]);
var activitiesRelations = relations(activities, ({ many }) => ({
  packages: many(packagesToActivities),
  bookingActivities: many(bookingActivities),
  media: many(activityMedia)
}));
var activityMediaRelations = relations(activityMedia, ({ one }) => ({
  activity: one(activities, {
    fields: [activityMedia.activityId],
    references: [activities.id]
  })
}));
var packagesRelations = relations(packages, ({ many }) => ({
  activities: many(packagesToActivities),
  bookings: many(bookings),
  media: many(packageMedia)
}));
var packageMediaRelations = relations(packageMedia, ({ one }) => ({
  package: one(packages, {
    fields: [packageMedia.packageId],
    references: [packages.id]
  })
}));
var packagesToActivitiesRelations = relations(packagesToActivities, ({ one }) => ({
  package: one(packages, {
    fields: [packagesToActivities.packageId],
    references: [packages.id]
  }),
  activity: one(activities, {
    fields: [packagesToActivities.activityId],
    references: [activities.id]
  })
}));
var bookingsRelations = relations(bookings, ({ one, many }) => ({
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id]
  }),
  package: one(packages, {
    fields: [bookings.packageId],
    references: [packages.id]
  }),
  activities: many(bookingActivities),
  // The itinerary
  payments: many(payments)
}));
var bookingActivitiesRelations = relations(bookingActivities, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [bookingActivities.bookingId],
    references: [bookings.id]
  }),
  activity: one(activities, {
    fields: [bookingActivities.activityId],
    references: [activities.id]
  }),
  guide: one(guides, {
    fields: [bookingActivities.guideId],
    references: [guides.id]
  }),
  reviews: many(reviews)
}));
var reviewsRelations = relations(reviews, ({ one }) => ({
  bookingActivity: one(bookingActivities, {
    fields: [reviews.bookingActivityId],
    references: [bookingActivities.id]
  }),
  user: one(user, {
    fields: [reviews.userId],
    references: [user.id]
  })
}));
var paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id]
  })
}));
var guidesRelations = relations(guides, ({ many }) => ({
  bookingActivities: many(bookingActivities)
}));

// src/db/db.ts
var pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
var db = drizzle(pool, { schema: schema_exports, casing: "snake_case" });

// src/lib/auth.ts
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { and, eq } from "drizzle-orm";
var auth = betterAuth({
  emailAndPassword: {
    enabled: true
  },
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  trustedOrigins: ["http://localhost:3001", "http://localhost:3000"],
  plugins: [
    openAPI()
  ]
});
var isUserAdmin = async (userId) => {
  const admin = await db.query.adminUser.findFirst({
    where: and(
      eq(adminUser.userId, userId),
      eq(adminUser.isActive, true)
    )
  });
  return !!admin;
};
var requireAdmin = async (c, next) => {
  try {
    const session2 = await auth.api.getSession({
      headers: c.req.raw.headers
    });
    console.log("Session in requireAdmin middleware:", session2);
    if (!session2 || !session2.user) {
      return c.json({ error: "Unauthorized - Please login" }, 401);
    }
    const isAdmin = await isUserAdmin(session2.user.id);
    if (!isAdmin) {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }
    const admin = await db.query.adminUser.findFirst({
      where: eq(adminUser.userId, session2.user.id)
    });
    c.set("user", session2.user);
    c.set("admin", admin);
    await next();
  } catch (error) {
    console.error("Admin authentication error:", error);
    return c.json({ error: "Internal server error during authentication" }, 500);
  }
};
var requireAuth = async (c, next) => {
  try {
    const session2 = await auth.api.getSession({
      headers: c.req.raw.headers
    });
    if (!session2 || !session2.user) {
      return c.json({ error: "Unauthorized - Please login" }, 401);
    }
    c.set("user", session2.user);
    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ error: "Internal server error during authentication" }, 500);
  }
};

// src/routes/activities.ts
import { Hono } from "hono";
import { and as and2, eq as eq2, gte, lte, like, sql, avg } from "drizzle-orm";
import { nanoid } from "nanoid";
import { zValidator } from "@hono/zod-validator";

// src/routes/activities.validation.ts
import { z } from "zod";
var createActivitySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z.string().max(2e3, "Description must be less than 2000 characters").optional().nullable(),
  imageUrl: z.url("Invalid image URL").optional().nullable(),
  location: z.string().min(1, "Location is required").max(255, "Location must be less than 255 characters"),
  durationMinutes: z.number().int("Duration must be an integer").positive("Duration must be positive"),
  price: z.number().nonnegative("Price must be non-negative")
});
var updateActivitySchema = z.object({
  name: z.string().min(1, "Name cannot be empty").max(255, "Name must be less than 255 characters").optional(),
  description: z.string().max(2e3, "Description must be less than 2000 characters").optional().nullable(),
  imageUrl: z.url("Invalid image URL").optional().nullable(),
  location: z.string().min(1, "Location cannot be empty").max(255, "Location must be less than 255 characters").optional(),
  durationMinutes: z.number().int("Duration must be an integer").positive("Duration must be positive").optional(),
  price: z.number().nonnegative("Price must be non-negative").optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});
var createActivityMediaSchema = z.object({
  media: z.array(
    z.object({
      mediaUrl: z.url("Invalid media URL"),
      mediaType: z.enum(["image", "video"], {
        message: "Media type must be either 'image' or 'video'"
      }),
      altText: z.string().max(500, "Alt text must be less than 500 characters").optional().nullable(),
      displayOrder: z.number().int("Display order must be an integer").nonnegative("Display order must be non-negative").optional()
    })
  ).min(1, "At least one media item is required")
});

// src/routes/activities.ts
var app = new Hono();
app.get("/", async (c) => {
  try {
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const location = c.req.query("location");
    const minPrice = c.req.query("minPrice");
    const maxPrice = c.req.query("maxPrice");
    const conditions = [];
    if (location) {
      conditions.push(like(activities.location, `%${location}%`));
    }
    if (minPrice) {
      const minPriceNum = Number.parseFloat(minPrice);
      if (!Number.isNaN(minPriceNum)) {
        conditions.push(gte(activities.price, minPrice));
      }
    }
    if (maxPrice) {
      const maxPriceNum = Number.parseFloat(maxPrice);
      if (!Number.isNaN(maxPriceNum)) {
        conditions.push(lte(activities.price, maxPrice));
      }
    }
    const whereClause = conditions.length > 0 ? and2(...conditions) : void 0;
    const offset = (page - 1) * limit;
    const activitiesData = await db.select().from(activities).where(whereClause).limit(limit).offset(offset).orderBy(activities.createdAt);
    const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(activities).where(whereClause);
    const totalPages = Math.ceil(count / limit);
    return c.json({
      success: true,
      data: activitiesData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch activities"
      },
      500
    );
  }
});
app.post("/", requireAdmin, zValidator("json", createActivitySchema), async (c) => {
  try {
    const body = c.req.valid("json");
    const activityId = nanoid();
    const [newActivity] = await db.insert(activities).values({
      id: activityId,
      name: body.name.trim(),
      description: body.description?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      location: body.location.trim(),
      durationMinutes: body.durationMinutes,
      price: body.price.toFixed(2)
    }).returning();
    return c.json(
      {
        success: true,
        message: "Activity created successfully",
        data: newActivity
      },
      201
    );
  } catch (error) {
    console.error("Error creating activity:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create activity"
      },
      500
    );
  }
});
app.patch("/:id", requireAdmin, zValidator("json", updateActivitySchema), async (c) => {
  try {
    const activityId = c.req.param("id");
    const body = c.req.valid("json");
    const [existingActivity] = await db.select().from(activities).where(eq2(activities.id, activityId)).limit(1);
    if (!existingActivity) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const updateData = {};
    if (body.name !== void 0) {
      updateData.name = body.name.trim();
    }
    if (body.description !== void 0) {
      updateData.description = body.description?.trim() || null;
    }
    if (body.imageUrl !== void 0) {
      updateData.imageUrl = body.imageUrl?.trim() || null;
    }
    if (body.location !== void 0) {
      updateData.location = body.location.trim();
    }
    if (body.durationMinutes !== void 0) {
      updateData.durationMinutes = body.durationMinutes;
    }
    if (body.price !== void 0) {
      updateData.price = body.price.toFixed(2);
    }
    const [updatedActivity] = await db.update(activities).set(updateData).where(eq2(activities.id, activityId)).returning();
    return c.json({
      success: true,
      message: "Activity updated successfully",
      data: updatedActivity
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update activity"
      },
      500
    );
  }
});
app.delete("/:id", requireAdmin, async (c) => {
  try {
    const activityId = c.req.param("id");
    const [existingActivity] = await db.select().from(activities).where(eq2(activities.id, activityId)).limit(1);
    if (!existingActivity) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const existingBookings = await db.select({ id: bookingActivities.id }).from(bookingActivities).where(eq2(bookingActivities.activityId, activityId)).limit(1);
    if (existingBookings.length > 0) {
      return c.json(
        {
          success: false,
          error: "Cannot delete activity: it is associated with existing bookings",
          details: "This activity is part of one or more bookings and cannot be deleted to preserve booking history."
        },
        409
        // Conflict status code
      );
    }
    await db.delete(activities).where(eq2(activities.id, activityId));
    return c.json({
      success: true,
      message: "Activity deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete activity"
      },
      500
    );
  }
});
app.get("/:id", async (c) => {
  try {
    const activityId = c.req.param("id");
    const [activity] = await db.select().from(activities).where(eq2(activities.id, activityId)).limit(1);
    if (!activity) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const media = await db.select().from(activityMedia).where(eq2(activityMedia.activityId, activityId)).orderBy(activityMedia.displayOrder);
    return c.json({
      success: true,
      data: {
        ...activity,
        media
      }
    });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch activity"
      },
      500
    );
  }
});
app.get("/:id/media", async (c) => {
  try {
    const activityId = c.req.param("id");
    const [activity] = await db.select({ id: activities.id }).from(activities).where(eq2(activities.id, activityId)).limit(1);
    if (!activity) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const media = await db.select().from(activityMedia).where(eq2(activityMedia.activityId, activityId)).orderBy(activityMedia.displayOrder);
    return c.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error("Error fetching activity media:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch activity media"
      },
      500
    );
  }
});
app.post("/:id/media", requireAdmin, zValidator("json", createActivityMediaSchema), async (c) => {
  try {
    const activityId = c.req.param("id");
    const body = c.req.valid("json");
    const [activity] = await db.select({ id: activities.id }).from(activities).where(eq2(activities.id, activityId)).limit(1);
    if (!activity) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const mediaItems = body.media.map((item) => ({
      id: nanoid(),
      activityId,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      altText: item.altText || null,
      displayOrder: item.displayOrder ?? 0
    }));
    const createdMedia = await db.insert(activityMedia).values(mediaItems).returning();
    return c.json(
      {
        success: true,
        message: `Successfully uploaded ${createdMedia.length} media item${createdMedia.length > 1 ? "s" : ""}`,
        data: createdMedia
      },
      201
    );
  } catch (error) {
    console.error("Error uploading activity media:", error);
    return c.json(
      {
        success: false,
        error: "Failed to upload activity media"
      },
      500
    );
  }
});
app.delete("/:id/media/:mediaId", requireAdmin, async (c) => {
  try {
    const activityId = c.req.param("id");
    const mediaId = c.req.param("mediaId");
    const [activity] = await db.select({ id: activities.id }).from(activities).where(eq2(activities.id, activityId)).limit(1);
    if (!activity) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const [media] = await db.select().from(activityMedia).where(
      and2(
        eq2(activityMedia.id, mediaId),
        eq2(activityMedia.activityId, activityId)
      )
    ).limit(1);
    if (!media) {
      return c.json(
        {
          success: false,
          error: "Media not found or does not belong to this activity"
        },
        404
      );
    }
    await db.delete(activityMedia).where(eq2(activityMedia.id, mediaId));
    return c.json({
      success: true,
      message: "Media deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting activity media:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete activity media"
      },
      500
    );
  }
});
app.get("/:id/reviews", async (c) => {
  try {
    const activityId = c.req.param("id");
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const [activity] = await db.select({ id: activities.id }).from(activities).where(eq2(activities.id, activityId)).limit(1);
    if (!activity) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const offset = (page - 1) * limit;
    const reviewsData = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        image: user.image
      }
    }).from(reviews).innerJoin(bookingActivities, eq2(reviews.bookingActivityId, bookingActivities.id)).innerJoin(user, eq2(reviews.userId, user.id)).where(eq2(bookingActivities.activityId, activityId)).orderBy(reviews.createdAt).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql`count(*)::int` }).from(reviews).innerJoin(bookingActivities, eq2(reviews.bookingActivityId, bookingActivities.id)).where(eq2(bookingActivities.activityId, activityId));
    const [{ avgRating }] = await db.select({ avgRating: avg(reviews.rating) }).from(reviews).innerJoin(bookingActivities, eq2(reviews.bookingActivityId, bookingActivities.id)).where(eq2(bookingActivities.activityId, activityId));
    const totalPages = Math.ceil(count / limit);
    const averageRating = avgRating ? Number.parseFloat(avgRating) : 0;
    return c.json({
      success: true,
      data: {
        reviews: reviewsData,
        averageRating: Math.round(averageRating * 10) / 10,
        // Round to 1 decimal place
        totalReviews: count
      },
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching activity reviews:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch activity reviews"
      },
      500
    );
  }
});
var activities_default = app;

// src/routes/packages.ts
import { Hono as Hono2 } from "hono";
import { eq as eq3, sql as sql2 } from "drizzle-orm";
import { nanoid as nanoid2 } from "nanoid";
import { zValidator as zValidator2 } from "@hono/zod-validator";

// src/routes/packages.validation.ts
import { z as z2 } from "zod";
var createPackageSchema = z2.object({
  name: z2.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z2.string().min(1, "Description is required").max(2e3, "Description must be less than 2000 characters"),
  imageUrl: z2.url("Invalid image URL").optional().nullable(),
  isCustom: z2.boolean().default(false),
  basePrice: z2.number().nonnegative("Base price must be non-negative").optional().nullable()
});
var updatePackageSchema = z2.object({
  name: z2.string().min(1, "Name cannot be empty").max(255, "Name must be less than 255 characters").optional(),
  description: z2.string().min(1, "Description cannot be empty").max(2e3, "Description must be less than 2000 characters").optional(),
  imageUrl: z2.url("Invalid image URL").optional().nullable(),
  isCustom: z2.boolean().optional(),
  basePrice: z2.number().nonnegative("Base price must be non-negative").optional().nullable()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});
var createPackageMediaSchema = z2.object({
  media: z2.array(
    z2.object({
      mediaUrl: z2.url("Invalid media URL"),
      mediaType: z2.enum(["image", "video"], {
        message: "Media type must be either 'image' or 'video'"
      }),
      altText: z2.string().max(500, "Alt text must be less than 500 characters").optional().nullable(),
      displayOrder: z2.number().int("Display order must be an integer").nonnegative("Display order must be non-negative").optional()
    })
  ).min(1, "At least one media item is required")
});
var addActivityToPackageSchema = z2.object({
  activityId: z2.string().min(1, "Activity ID is required")
});

// src/routes/packages.ts
var app2 = new Hono2();
app2.get("/", async (c) => {
  try {
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const offset = (page - 1) * limit;
    const packagesData = await db.select({
      id: packages.id,
      name: packages.name,
      description: packages.description,
      imageUrl: packages.imageUrl,
      isCustom: packages.isCustom,
      basePrice: packages.basePrice,
      createdAt: packages.createdAt,
      updatedAt: packages.updatedAt,
      activityCount: sql2`count(DISTINCT ${packagesToActivities.activityId})::int`
    }).from(packages).leftJoin(packagesToActivities, eq3(packages.id, packagesToActivities.packageId)).groupBy(packages.id).limit(limit).offset(offset).orderBy(packages.createdAt);
    const [{ count }] = await db.select({ count: sql2`count(*)::int` }).from(packages);
    const totalPages = Math.ceil(count / limit);
    return c.json({
      success: true,
      data: packagesData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch packages"
      },
      500
    );
  }
});
app2.get("/:id", async (c) => {
  try {
    const packageId = c.req.param("id");
    const [packageData] = await db.select().from(packages).where(eq3(packages.id, packageId));
    if (!packageData) {
      return c.json(
        {
          success: false,
          error: "Package not found"
        },
        404
      );
    }
    const packageActivities = await db.select({
      id: activities.id,
      name: activities.name,
      description: activities.description,
      imageUrl: activities.imageUrl,
      location: activities.location,
      durationMinutes: activities.durationMinutes,
      price: activities.price,
      createdAt: activities.createdAt,
      updatedAt: activities.updatedAt
    }).from(packagesToActivities).innerJoin(activities, eq3(packagesToActivities.activityId, activities.id)).where(eq3(packagesToActivities.packageId, packageId));
    const media = await db.select().from(packageMedia).where(eq3(packageMedia.packageId, packageId)).orderBy(packageMedia.displayOrder);
    return c.json({
      success: true,
      data: {
        ...packageData,
        activities: packageActivities,
        media
      }
    });
  } catch (error) {
    console.error("Error fetching package:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch package"
      },
      500
    );
  }
});
app2.get("/:id/activities", async (c) => {
  try {
    const packageId = c.req.param("id");
    const [packageExists] = await db.select({ id: packages.id }).from(packages).where(eq3(packages.id, packageId));
    if (!packageExists) {
      return c.json(
        {
          success: false,
          error: "Package not found"
        },
        404
      );
    }
    const packageActivities = await db.select({
      id: activities.id,
      name: activities.name,
      description: activities.description,
      imageUrl: activities.imageUrl,
      location: activities.location,
      durationMinutes: activities.durationMinutes,
      price: activities.price,
      createdAt: activities.createdAt,
      updatedAt: activities.updatedAt
    }).from(packagesToActivities).innerJoin(activities, eq3(packagesToActivities.activityId, activities.id)).where(eq3(packagesToActivities.packageId, packageId));
    return c.json({
      success: true,
      data: packageActivities
    });
  } catch (error) {
    console.error("Error fetching package activities:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch package activities"
      },
      500
    );
  }
});
app2.get("/:id/media", async (c) => {
  try {
    const packageId = c.req.param("id");
    const [packageExists] = await db.select({ id: packages.id }).from(packages).where(eq3(packages.id, packageId));
    if (!packageExists) {
      return c.json(
        {
          success: false,
          error: "Package not found"
        },
        404
      );
    }
    const media = await db.select().from(packageMedia).where(eq3(packageMedia.packageId, packageId)).orderBy(packageMedia.displayOrder);
    return c.json({
      success: true,
      data: media
    });
  } catch (error) {
    console.error("Error fetching package media:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch package media"
      },
      500
    );
  }
});
app2.post("/", requireAdmin, zValidator2("json", createPackageSchema), async (c) => {
  try {
    const body = c.req.valid("json");
    const packageId = nanoid2();
    const [newPackage] = await db.insert(packages).values({
      id: packageId,
      name: body.name,
      description: body.description,
      imageUrl: body.imageUrl,
      isCustom: body.isCustom,
      basePrice: body.basePrice?.toString()
    }).returning();
    return c.json(
      {
        success: true,
        data: newPackage
      },
      201
    );
  } catch (error) {
    console.error("Error creating package:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create package"
      },
      500
    );
  }
});
app2.patch("/:id", requireAdmin, zValidator2("json", updatePackageSchema), async (c) => {
  try {
    const packageId = c.req.param("id");
    const body = c.req.valid("json");
    const [existingPackage] = await db.select().from(packages).where(eq3(packages.id, packageId));
    if (!existingPackage) {
      return c.json(
        {
          success: false,
          error: "Package not found"
        },
        404
      );
    }
    const updateData = {};
    if (body.name !== void 0) updateData.name = body.name;
    if (body.description !== void 0) updateData.description = body.description;
    if (body.imageUrl !== void 0) updateData.imageUrl = body.imageUrl;
    if (body.isCustom !== void 0) updateData.isCustom = body.isCustom;
    if (body.basePrice !== void 0) updateData.basePrice = body.basePrice?.toString();
    const [updatedPackage] = await db.update(packages).set(updateData).where(eq3(packages.id, packageId)).returning();
    return c.json({
      success: true,
      data: updatedPackage
    });
  } catch (error) {
    console.error("Error updating package:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update package"
      },
      500
    );
  }
});
app2.delete("/:id", requireAdmin, async (c) => {
  try {
    const packageId = c.req.param("id");
    const [existingPackage] = await db.select().from(packages).where(eq3(packages.id, packageId));
    if (!existingPackage) {
      return c.json(
        {
          success: false,
          error: "Package not found"
        },
        404
      );
    }
    await db.delete(packages).where(eq3(packages.id, packageId));
    return c.json({
      success: true,
      message: "Package deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting package:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete package"
      },
      500
    );
  }
});
app2.post("/:id/activities", requireAdmin, zValidator2("json", addActivityToPackageSchema), async (c) => {
  try {
    const packageId = c.req.param("id");
    const body = c.req.valid("json");
    const [packageExists] = await db.select({ id: packages.id }).from(packages).where(eq3(packages.id, packageId));
    if (!packageExists) {
      return c.json(
        {
          success: false,
          error: "Package not found"
        },
        404
      );
    }
    const [activityExists] = await db.select({ id: activities.id }).from(activities).where(eq3(activities.id, body.activityId));
    if (!activityExists) {
      return c.json(
        {
          success: false,
          error: "Activity not found"
        },
        404
      );
    }
    const [existingLink] = await db.select().from(packagesToActivities).where(
      sql2`${packagesToActivities.packageId} = ${packageId} AND ${packagesToActivities.activityId} = ${body.activityId}`
    );
    if (existingLink) {
      return c.json(
        {
          success: false,
          error: "Activity is already in this package"
        },
        400
      );
    }
    await db.insert(packagesToActivities).values({
      packageId,
      activityId: body.activityId
    });
    return c.json(
      {
        success: true,
        message: "Activity added to package successfully"
      },
      201
    );
  } catch (error) {
    console.error("Error adding activity to package:", error);
    return c.json(
      {
        success: false,
        error: "Failed to add activity to package"
      },
      500
    );
  }
});
app2.delete("/:id/activities/:activityId", requireAdmin, async (c) => {
  try {
    const packageId = c.req.param("id");
    const activityId = c.req.param("activityId");
    const [existingLink] = await db.select().from(packagesToActivities).where(
      sql2`${packagesToActivities.packageId} = ${packageId} AND ${packagesToActivities.activityId} = ${activityId}`
    );
    if (!existingLink) {
      return c.json(
        {
          success: false,
          error: "Activity is not in this package"
        },
        404
      );
    }
    await db.delete(packagesToActivities).where(
      sql2`${packagesToActivities.packageId} = ${packageId} AND ${packagesToActivities.activityId} = ${activityId}`
    );
    return c.json({
      success: true,
      message: "Activity removed from package successfully"
    });
  } catch (error) {
    console.error("Error removing activity from package:", error);
    return c.json(
      {
        success: false,
        error: "Failed to remove activity from package"
      },
      500
    );
  }
});
app2.post("/:id/media", requireAdmin, zValidator2("json", createPackageMediaSchema), async (c) => {
  try {
    const packageId = c.req.param("id");
    const body = c.req.valid("json");
    const [packageExists] = await db.select({ id: packages.id }).from(packages).where(eq3(packages.id, packageId));
    if (!packageExists) {
      return c.json(
        {
          success: false,
          error: "Package not found"
        },
        404
      );
    }
    const mediaRecords = body.media.map((item, index2) => ({
      id: nanoid2(),
      packageId,
      mediaUrl: item.mediaUrl,
      mediaType: item.mediaType,
      altText: item.altText,
      displayOrder: item.displayOrder ?? index2
    }));
    const insertedMedia = await db.insert(packageMedia).values(mediaRecords).returning();
    return c.json(
      {
        success: true,
        data: insertedMedia
      },
      201
    );
  } catch (error) {
    console.error("Error uploading package media:", error);
    return c.json(
      {
        success: false,
        error: "Failed to upload package media"
      },
      500
    );
  }
});
app2.delete("/:id/media/:mediaId", requireAdmin, async (c) => {
  try {
    const packageId = c.req.param("id");
    const mediaId = c.req.param("mediaId");
    const [existingMedia] = await db.select().from(packageMedia).where(
      sql2`${packageMedia.id} = ${mediaId} AND ${packageMedia.packageId} = ${packageId}`
    );
    if (!existingMedia) {
      return c.json(
        {
          success: false,
          error: "Media not found or does not belong to this package"
        },
        404
      );
    }
    await db.delete(packageMedia).where(eq3(packageMedia.id, mediaId));
    return c.json({
      success: true,
      message: "Media deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting package media:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete package media"
      },
      500
    );
  }
});
var packages_default = app2;

// src/routes/bookings.ts
import { Hono as Hono3 } from "hono";
import { and as and3, eq as eq4, sql as sql3, inArray } from "drizzle-orm";
import { nanoid as nanoid3 } from "nanoid";

// src/routes/bookings.validation.ts
import { z as z3 } from "zod";
var listBookingsQuerySchema = z3.object({
  page: z3.string().optional().transform((val) => val ? Math.max(1, parseInt(val, 10)) : 1),
  limit: z3.string().optional().transform((val) => val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 10),
  status: z3.enum(["pending", "confirmed", "cancelled", "completed"]).optional()
});
var createBookingSchema = z3.object({
  packageId: z3.string().optional(),
  // Optional: for package-based bookings
  activityIds: z3.array(z3.string()).min(1, "At least one activity is required"),
  // For custom bookings or package bookings
  startDate: z3.string().datetime({ message: "Invalid start date format. Use ISO 8601 format." }),
  endDate: z3.string().datetime({ message: "Invalid end date format. Use ISO 8601 format." }),
  specialRequests: z3.string().optional(),
  scheduledTimes: z3.record(z3.string(), z3.string().datetime()).optional()
  // Map of activityId to scheduled time
}).refine(
  (data) => new Date(data.endDate) > new Date(data.startDate),
  {
    message: "End date must be after start date",
    path: ["endDate"]
  }
);
var updateBookingSchema = z3.object({
  startDate: z3.string().datetime({ message: "Invalid start date format. Use ISO 8601 format." }).optional(),
  endDate: z3.string().datetime({ message: "Invalid end date format. Use ISO 8601 format." }).optional(),
  specialRequests: z3.string().optional(),
  status: z3.enum(["pending", "confirmed", "cancelled", "completed"]).optional()
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"]
  }
);
var addActivityToBookingSchema = z3.object({
  activityId: z3.string().min(1, "Activity ID is required"),
  scheduledAt: z3.string().datetime({ message: "Invalid scheduled time format. Use ISO 8601 format." }).optional()
});
var updateBookingActivitySchema = z3.object({
  scheduledAt: z3.string().datetime({ message: "Invalid scheduled time format. Use ISO 8601 format." }).optional()
});
var assignGuideSchema = z3.object({
  guideId: z3.string().min(1, "Guide ID is required")
});
var getBookingParamsSchema = z3.object({
  id: z3.string().min(1, "Booking ID is required")
});

// src/routes/bookings.ts
var app3 = new Hono3();
app3.get("/", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const status = c.req.query("status");
    const conditions = [eq4(bookings.userId, user2.id)];
    if (status) {
      const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
      if (validStatuses.includes(status)) {
        conditions.push(eq4(bookings.status, status));
      } else {
        return c.json({
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        }, 400);
      }
    }
    const whereClause = and3(...conditions);
    const offset = (page - 1) * limit;
    const bookingsData = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      packageId: bookings.packageId,
      packageName: packages.name,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      specialRequests: bookings.specialRequests,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt
    }).from(bookings).leftJoin(packages, eq4(bookings.packageId, packages.id)).where(whereClause).limit(limit).offset(offset).orderBy(bookings.createdAt);
    const [{ count }] = await db.select({ count: sql3`count(*)::int` }).from(bookings).where(whereClause);
    const totalPages = Math.ceil(count / limit);
    const bookingsWithDetails = await Promise.all(
      bookingsData.map(async (booking) => {
        const [activityCountResult] = await db.select({ count: sql3`count(*)::int` }).from(bookingActivities).where(eq4(bookingActivities.bookingId, booking.id));
        return {
          ...booking,
          activityCount: activityCountResult.count
        };
      })
    );
    return c.json({
      success: true,
      data: bookingsWithDetails,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch bookings"
      },
      500
    );
  }
});
app3.get("/:id", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    const bookingId = c.req.param("id");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const isAdmin = await isUserAdmin(user2.id);
    const [booking] = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      packageId: bookings.packageId,
      packageName: packages.name,
      packageDescription: packages.description,
      packageBasePrice: packages.basePrice,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      specialRequests: bookings.specialRequests,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt
    }).from(bookings).leftJoin(packages, eq4(bookings.packageId, packages.id)).where(eq4(bookings.id, bookingId)).limit(1);
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    if (booking.userId !== user2.id && !isAdmin) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have access to this booking"
      }, 403);
    }
    const bookingActivitiesData = await db.select({
      id: bookingActivities.id,
      bookingId: bookingActivities.bookingId,
      activityId: bookingActivities.activityId,
      activityName: activities.name,
      activityDescription: activities.description,
      activityLocation: activities.location,
      activityDuration: activities.durationMinutes,
      activityImageUrl: activities.imageUrl,
      priceAtBooking: bookingActivities.priceAtBooking,
      scheduledAt: bookingActivities.scheduledAt,
      guideId: bookingActivities.guideId,
      guideName: guides.name,
      guideEmail: guides.email,
      guidePhone: guides.phone,
      guideImageUrl: guides.imageUrl
    }).from(bookingActivities).leftJoin(activities, eq4(bookingActivities.activityId, activities.id)).leftJoin(guides, eq4(bookingActivities.guideId, guides.id)).where(eq4(bookingActivities.bookingId, bookingId)).orderBy(bookingActivities.scheduledAt);
    const paymentsData = await db.select({
      id: payments.id,
      amount: payments.amount,
      currency: payments.currency,
      paymentMethod: payments.paymentMethod,
      paymentStatus: payments.paymentStatus,
      transactionId: payments.transactionId,
      paymentProvider: payments.paymentProvider,
      createdAt: payments.createdAt
    }).from(payments).where(eq4(payments.bookingId, bookingId)).orderBy(payments.createdAt);
    const totalPaid = paymentsData.filter((payment) => payment.paymentStatus === "completed").reduce((sum, payment) => sum + Number(payment.amount), 0);
    const hasFailedPayment = paymentsData.some((p) => p.paymentStatus === "failed");
    const hasPendingPayment = paymentsData.some((p) => p.paymentStatus === "pending" || p.paymentStatus === "processing");
    const hasRefundedPayment = paymentsData.some((p) => p.paymentStatus === "refunded" || p.paymentStatus === "partially_refunded");
    let paymentStatus;
    if (totalPaid >= Number(booking.totalPrice)) {
      paymentStatus = hasRefundedPayment ? "refunded" : "paid";
    } else if (totalPaid > 0) {
      paymentStatus = "partially_paid";
    } else if (hasPendingPayment) {
      paymentStatus = "pending";
    } else if (hasFailedPayment) {
      paymentStatus = "failed";
    } else {
      paymentStatus = "unpaid";
    }
    const response = {
      success: true,
      data: {
        booking: {
          id: booking.id,
          userId: booking.userId,
          status: booking.status,
          totalPrice: booking.totalPrice,
          startDate: booking.startDate,
          endDate: booking.endDate,
          specialRequests: booking.specialRequests,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          package: booking.packageId ? {
            id: booking.packageId,
            name: booking.packageName,
            description: booking.packageDescription,
            basePrice: booking.packageBasePrice
          } : null
        },
        activities: bookingActivitiesData.map((ba) => ({
          id: ba.id,
          activity: {
            id: ba.activityId,
            name: ba.activityName,
            description: ba.activityDescription,
            location: ba.activityLocation,
            durationMinutes: ba.activityDuration,
            imageUrl: ba.activityImageUrl
          },
          priceAtBooking: ba.priceAtBooking,
          scheduledAt: ba.scheduledAt,
          guide: ba.guideId ? {
            id: ba.guideId,
            name: ba.guideName,
            email: ba.guideEmail,
            phone: ba.guidePhone,
            imageUrl: ba.guideImageUrl
          } : null
        })),
        payments: {
          status: paymentStatus,
          totalPrice: booking.totalPrice,
          totalPaid: totalPaid.toFixed(2),
          balance: (Number(booking.totalPrice) - totalPaid).toFixed(2),
          transactions: paymentsData
        }
      }
    };
    return c.json(response);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch booking"
      },
      500
    );
  }
});
app3.get("/:id/activities", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    const bookingId = c.req.param("id");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const isAdmin = await isUserAdmin(user2.id);
    const [booking] = await db.select({
      id: bookings.id,
      userId: bookings.userId
    }).from(bookings).where(eq4(bookings.id, bookingId)).limit(1);
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    if (booking.userId !== user2.id && !isAdmin) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have access to this booking"
      }, 403);
    }
    const bookingActivitiesData = await db.select({
      id: bookingActivities.id,
      bookingId: bookingActivities.bookingId,
      activityId: bookingActivities.activityId,
      activityName: activities.name,
      activityDescription: activities.description,
      activityLocation: activities.location,
      activityDuration: activities.durationMinutes,
      activityImageUrl: activities.imageUrl,
      activityCurrentPrice: activities.price,
      // Current catalog price for reference
      priceAtBooking: bookingActivities.priceAtBooking,
      scheduledAt: bookingActivities.scheduledAt,
      guideId: bookingActivities.guideId,
      guideName: guides.name,
      guideEmail: guides.email,
      guidePhone: guides.phone,
      guideBio: guides.bio,
      guideSpecialties: guides.specialties,
      guideImageUrl: guides.imageUrl,
      guideIsActive: guides.isActive
    }).from(bookingActivities).leftJoin(activities, eq4(bookingActivities.activityId, activities.id)).leftJoin(guides, eq4(bookingActivities.guideId, guides.id)).where(eq4(bookingActivities.bookingId, bookingId)).orderBy(bookingActivities.scheduledAt);
    const response = {
      success: true,
      data: {
        bookingId,
        activityCount: bookingActivitiesData.length,
        activities: bookingActivitiesData.map((ba) => ({
          id: ba.id,
          activity: {
            id: ba.activityId,
            name: ba.activityName,
            description: ba.activityDescription,
            location: ba.activityLocation,
            durationMinutes: ba.activityDuration,
            imageUrl: ba.activityImageUrl,
            currentPrice: ba.activityCurrentPrice
            // For reference/comparison
          },
          priceAtBooking: ba.priceAtBooking,
          // Historical snapshot
          scheduledAt: ba.scheduledAt,
          guide: ba.guideId ? {
            id: ba.guideId,
            name: ba.guideName,
            email: ba.guideEmail,
            phone: ba.guidePhone,
            bio: ba.guideBio,
            specialties: ba.guideSpecialties,
            imageUrl: ba.guideImageUrl,
            isActive: ba.guideIsActive
          } : null
        }))
      }
    };
    return c.json(response);
  } catch (error) {
    console.error("Error fetching booking activities:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch booking activities"
      },
      500
    );
  }
});
app3.post("/", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const body = await c.req.json();
    const validation = createBookingSchema.safeParse(body);
    if (!validation.success) {
      return c.json({
        success: false,
        error: "Validation failed",
        details: validation.error.format()
      }, 400);
    }
    const { packageId, activityIds, startDate, endDate, specialRequests, scheduledTimes } = validation.data;
    let packageData = null;
    if (packageId) {
      const [pkg] = await db.select().from(packages).where(eq4(packages.id, packageId)).limit(1);
      if (!pkg) {
        return c.json({
          success: false,
          error: "Package not found"
        }, 404);
      }
      packageData = pkg;
    }
    const activitiesData = await db.select().from(activities).where(inArray(activities.id, activityIds));
    if (activitiesData.length !== activityIds.length) {
      return c.json({
        success: false,
        error: "One or more activities not found"
      }, 404);
    }
    if (packageId) {
      const packageActivities = await db.select({ activityId: packagesToActivities.activityId }).from(packagesToActivities).where(eq4(packagesToActivities.packageId, packageId));
      const packageActivityIds = packageActivities.map((pa) => pa.activityId);
      const invalidActivities = activityIds.filter((id) => !packageActivityIds.includes(id));
      if (invalidActivities.length > 0) {
        return c.json({
          success: false,
          error: `Activities ${invalidActivities.join(", ")} are not part of this package`
        }, 400);
      }
    }
    const totalPrice = activitiesData.reduce((sum, activity) => {
      return sum + Number(activity.price);
    }, 0);
    const bookingId = nanoid3();
    await db.insert(bookings).values({
      id: bookingId,
      userId: user2.id,
      packageId: packageId || null,
      status: "pending",
      totalPrice: totalPrice.toFixed(2),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      specialRequests: specialRequests || null
    });
    const bookingActivitiesData = activitiesData.map((activity) => ({
      id: nanoid3(),
      bookingId,
      activityId: activity.id,
      priceAtBooking: activity.price,
      // Snapshot the current price
      scheduledAt: scheduledTimes?.[activity.id] ? new Date(scheduledTimes[activity.id]) : null,
      guideId: null
    }));
    await db.insert(bookingActivities).values(bookingActivitiesData);
    const [createdBooking] = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      packageId: bookings.packageId,
      packageName: packages.name,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      specialRequests: bookings.specialRequests,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt
    }).from(bookings).leftJoin(packages, eq4(bookings.packageId, packages.id)).where(eq4(bookings.id, bookingId)).limit(1);
    return c.json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...createdBooking,
        activityCount: bookingActivitiesData.length
      }
    }, 201);
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create booking"
      },
      500
    );
  }
});
app3.patch("/:id", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    const bookingId = c.req.param("id");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const body = await c.req.json();
    const validation = updateBookingSchema.safeParse(body);
    if (!validation.success) {
      return c.json({
        success: false,
        error: "Validation failed",
        details: validation.error.format()
      }, 400);
    }
    const [booking] = await db.select().from(bookings).where(eq4(bookings.id, bookingId)).limit(1);
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    if (booking.userId !== user2.id) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have access to this booking"
      }, 403);
    }
    if (booking.status === "cancelled") {
      return c.json({
        success: false,
        error: "Cannot update a cancelled booking"
      }, 400);
    }
    const updateData = {
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (validation.data.startDate) {
      updateData.startDate = new Date(validation.data.startDate);
    }
    if (validation.data.endDate) {
      updateData.endDate = new Date(validation.data.endDate);
    }
    if (validation.data.specialRequests !== void 0) {
      updateData.specialRequests = validation.data.specialRequests;
    }
    if (validation.data.status) {
      updateData.status = validation.data.status;
    }
    await db.update(bookings).set(updateData).where(eq4(bookings.id, bookingId));
    const [updatedBooking] = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      packageId: bookings.packageId,
      packageName: packages.name,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      specialRequests: bookings.specialRequests,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt
    }).from(bookings).leftJoin(packages, eq4(bookings.packageId, packages.id)).where(eq4(bookings.id, bookingId)).limit(1);
    return c.json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update booking"
      },
      500
    );
  }
});
app3.patch("/:id/cancel", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    const bookingId = c.req.param("id");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const [booking] = await db.select().from(bookings).where(eq4(bookings.id, bookingId)).limit(1);
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    if (booking.userId !== user2.id) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have access to this booking"
      }, 403);
    }
    if (booking.status === "cancelled") {
      return c.json({
        success: false,
        error: "Booking is already cancelled"
      }, 400);
    }
    await db.update(bookings).set({
      status: "cancelled",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq4(bookings.id, bookingId));
    const [cancelledBooking] = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      packageId: bookings.packageId,
      packageName: packages.name,
      status: bookings.status,
      totalPrice: bookings.totalPrice,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      specialRequests: bookings.specialRequests,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt
    }).from(bookings).leftJoin(packages, eq4(bookings.packageId, packages.id)).where(eq4(bookings.id, bookingId)).limit(1);
    return c.json({
      success: true,
      message: "Booking cancelled successfully. Refund processing may be initiated separately.",
      data: cancelledBooking
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return c.json(
      {
        success: false,
        error: "Failed to cancel booking"
      },
      500
    );
  }
});
app3.post("/:id/activities", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    const bookingId = c.req.param("id");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const body = await c.req.json();
    const validation = addActivityToBookingSchema.safeParse(body);
    if (!validation.success) {
      return c.json({
        success: false,
        error: "Validation failed",
        details: validation.error.format()
      }, 400);
    }
    const { activityId, scheduledAt } = validation.data;
    const [booking] = await db.select().from(bookings).where(eq4(bookings.id, bookingId)).limit(1);
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    if (booking.userId !== user2.id) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have access to this booking"
      }, 403);
    }
    if (booking.status === "cancelled") {
      return c.json({
        success: false,
        error: "Cannot add activities to a cancelled booking"
      }, 400);
    }
    const [activity] = await db.select().from(activities).where(eq4(activities.id, activityId)).limit(1);
    if (!activity) {
      return c.json({
        success: false,
        error: "Activity not found"
      }, 404);
    }
    const [existingActivity] = await db.select().from(bookingActivities).where(
      and3(
        eq4(bookingActivities.bookingId, bookingId),
        eq4(bookingActivities.activityId, activityId)
      )
    ).limit(1);
    if (existingActivity) {
      return c.json({
        success: false,
        error: "Activity is already part of this booking"
      }, 400);
    }
    const bookingActivityId = nanoid3();
    await db.insert(bookingActivities).values({
      id: bookingActivityId,
      bookingId,
      activityId,
      priceAtBooking: activity.price,
      // Snapshot current price
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      guideId: null
    });
    const newTotalPrice = Number(booking.totalPrice) + Number(activity.price);
    await db.update(bookings).set({
      totalPrice: newTotalPrice.toFixed(2),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq4(bookings.id, bookingId));
    const [createdActivity] = await db.select({
      id: bookingActivities.id,
      bookingId: bookingActivities.bookingId,
      activityId: bookingActivities.activityId,
      activityName: activities.name,
      activityDescription: activities.description,
      activityLocation: activities.location,
      activityDuration: activities.durationMinutes,
      activityImageUrl: activities.imageUrl,
      priceAtBooking: bookingActivities.priceAtBooking,
      scheduledAt: bookingActivities.scheduledAt
    }).from(bookingActivities).leftJoin(activities, eq4(bookingActivities.activityId, activities.id)).where(eq4(bookingActivities.id, bookingActivityId)).limit(1);
    return c.json({
      success: true,
      message: "Activity added to booking successfully",
      data: {
        bookingActivity: createdActivity,
        updatedTotalPrice: newTotalPrice.toFixed(2)
      }
    }, 201);
  } catch (error) {
    console.error("Error adding activity to booking:", error);
    return c.json(
      {
        success: false,
        error: "Failed to add activity to booking"
      },
      500
    );
  }
});
app3.patch("/:id/activities/:activityId", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    const bookingId = c.req.param("id");
    const activityId = c.req.param("activityId");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const body = await c.req.json();
    const validation = updateBookingActivitySchema.safeParse(body);
    if (!validation.success) {
      return c.json({
        success: false,
        error: "Validation failed",
        details: validation.error.format()
      }, 400);
    }
    const [booking] = await db.select().from(bookings).where(eq4(bookings.id, bookingId)).limit(1);
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    if (booking.userId !== user2.id) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have access to this booking"
      }, 403);
    }
    const [bookingActivity] = await db.select().from(bookingActivities).where(
      and3(
        eq4(bookingActivities.bookingId, bookingId),
        eq4(bookingActivities.activityId, activityId)
      )
    ).limit(1);
    if (!bookingActivity) {
      return c.json({
        success: false,
        error: "Activity not found in this booking"
      }, 404);
    }
    const updateData = {};
    if (validation.data.scheduledAt) {
      updateData.scheduledAt = new Date(validation.data.scheduledAt);
    }
    await db.update(bookingActivities).set(updateData).where(eq4(bookingActivities.id, bookingActivity.id));
    const [updatedActivity] = await db.select({
      id: bookingActivities.id,
      bookingId: bookingActivities.bookingId,
      activityId: bookingActivities.activityId,
      activityName: activities.name,
      activityDescription: activities.description,
      activityLocation: activities.location,
      activityDuration: activities.durationMinutes,
      activityImageUrl: activities.imageUrl,
      priceAtBooking: bookingActivities.priceAtBooking,
      scheduledAt: bookingActivities.scheduledAt,
      guideId: bookingActivities.guideId,
      guideName: guides.name
    }).from(bookingActivities).leftJoin(activities, eq4(bookingActivities.activityId, activities.id)).leftJoin(guides, eq4(bookingActivities.guideId, guides.id)).where(eq4(bookingActivities.id, bookingActivity.id)).limit(1);
    return c.json({
      success: true,
      message: "Booking activity updated successfully",
      data: updatedActivity
    });
  } catch (error) {
    console.error("Error updating booking activity:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update booking activity"
      },
      500
    );
  }
});
app3.patch("/:id/activities/:activityId/guide", requireAdmin, async (c) => {
  try {
    const bookingId = c.req.param("id");
    const activityId = c.req.param("activityId");
    const body = await c.req.json();
    const validation = assignGuideSchema.safeParse(body);
    if (!validation.success) {
      return c.json({
        success: false,
        error: "Validation failed",
        details: validation.error.format()
      }, 400);
    }
    const { guideId } = validation.data;
    const [booking] = await db.select().from(bookings).where(eq4(bookings.id, bookingId)).limit(1);
    if (!booking) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    const [bookingActivity] = await db.select().from(bookingActivities).where(
      and3(
        eq4(bookingActivities.bookingId, bookingId),
        eq4(bookingActivities.activityId, activityId)
      )
    ).limit(1);
    if (!bookingActivity) {
      return c.json({
        success: false,
        error: "Activity not found in this booking"
      }, 404);
    }
    const [guide] = await db.select().from(guides).where(eq4(guides.id, guideId)).limit(1);
    if (!guide) {
      return c.json({
        success: false,
        error: "Guide not found"
      }, 404);
    }
    if (!guide.isActive) {
      return c.json({
        success: false,
        error: "Guide is not active and cannot be assigned"
      }, 400);
    }
    await db.update(bookingActivities).set({
      guideId
    }).where(eq4(bookingActivities.id, bookingActivity.id));
    const [updatedActivity] = await db.select({
      id: bookingActivities.id,
      bookingId: bookingActivities.bookingId,
      activityId: bookingActivities.activityId,
      activityName: activities.name,
      activityDescription: activities.description,
      activityLocation: activities.location,
      activityDuration: activities.durationMinutes,
      activityImageUrl: activities.imageUrl,
      priceAtBooking: bookingActivities.priceAtBooking,
      scheduledAt: bookingActivities.scheduledAt,
      guideId: bookingActivities.guideId,
      guideName: guides.name,
      guideEmail: guides.email,
      guidePhone: guides.phone,
      guideBio: guides.bio,
      guideImageUrl: guides.imageUrl
    }).from(bookingActivities).leftJoin(activities, eq4(bookingActivities.activityId, activities.id)).leftJoin(guides, eq4(bookingActivities.guideId, guides.id)).where(eq4(bookingActivities.id, bookingActivity.id)).limit(1);
    return c.json({
      success: true,
      message: "Guide assigned successfully",
      data: updatedActivity
    });
  } catch (error) {
    console.error("Error assigning guide:", error);
    return c.json(
      {
        success: false,
        error: "Failed to assign guide"
      },
      500
    );
  }
});
app3.get("/:id/payments", requireAdmin, async (c) => {
  try {
    const paramsValidation = getBookingParamsSchema.safeParse({
      id: c.req.param("id")
    });
    if (!paramsValidation.success) {
      return c.json({
        success: false,
        error: "Invalid booking ID",
        details: paramsValidation.error.message
      }, 400);
    }
    const { id: bookingId } = paramsValidation.data;
    const bookingData = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      startDate: bookings.startDate,
      endDate: bookings.endDate,
      createdAt: bookings.createdAt
    }).from(bookings).where(eq4(bookings.id, bookingId)).limit(1);
    if (!bookingData || bookingData.length === 0) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    const booking = bookingData[0];
    const paymentsData = await db.select({
      id: payments.id,
      amount: payments.amount,
      currency: payments.currency,
      paymentMethod: payments.paymentMethod,
      paymentStatus: payments.paymentStatus,
      transactionId: payments.transactionId,
      paymentProvider: payments.paymentProvider,
      paymentIntentId: payments.paymentIntentId,
      metadata: payments.metadata,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt
    }).from(payments).where(eq4(payments.bookingId, bookingId)).orderBy(payments.createdAt);
    const totalPaid = paymentsData.reduce((sum, payment) => {
      if (payment.paymentStatus === "completed") {
        return sum + parseFloat(payment.amount);
      }
      return sum;
    }, 0);
    const bookingTotal = parseFloat(booking.totalPrice);
    const remainingAmount = bookingTotal - totalPaid;
    return c.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          totalPrice: booking.totalPrice,
          status: booking.status,
          startDate: booking.startDate,
          endDate: booking.endDate
        },
        payments: paymentsData.map((payment) => ({
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          paymentMethod: payment.paymentMethod,
          paymentStatus: payment.paymentStatus,
          transactionId: payment.transactionId,
          paymentProvider: payment.paymentProvider,
          paymentIntentId: payment.paymentIntentId,
          metadata: payment.metadata ? JSON.parse(payment.metadata) : null,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt
        })),
        summary: {
          totalPaid: totalPaid.toFixed(2),
          bookingTotal: bookingTotal.toFixed(2),
          remainingAmount: remainingAmount.toFixed(2),
          currency: paymentsData[0]?.currency || "USD",
          paymentCount: paymentsData.length,
          completedPayments: paymentsData.filter((p) => p.paymentStatus === "completed").length,
          pendingPayments: paymentsData.filter((p) => p.paymentStatus === "pending").length,
          failedPayments: paymentsData.filter((p) => p.paymentStatus === "failed").length
        }
      }
    });
  } catch (error) {
    console.error("Error fetching booking payments:", error);
    return c.json({
      success: false,
      error: "Internal server error while fetching booking payments"
    }, 500);
  }
});
var bookings_default = app3;

// src/routes/payments.ts
import { Hono as Hono4 } from "hono";
import { eq as eq5 } from "drizzle-orm";

// src/routes/payments.validation.ts
import { z as z4 } from "zod";
var getPaymentParamsSchema = z4.object({
  id: z4.string().min(1, "Payment ID is required")
});
var createPaymentSchema = z4.object({
  bookingId: z4.string().min(1, "Booking ID is required"),
  amount: z4.number().positive("Amount must be positive").optional(),
  // Optional: defaults to booking total
  currency: z4.string().length(3, "Currency must be a 3-letter ISO code").default("USD"),
  paymentMethod: z4.enum([
    "credit_card",
    "debit_card",
    "paypal",
    "bank_transfer",
    "cash",
    "other"
  ]).default("credit_card"),
  paymentProvider: z4.enum(["stripe", "paypal", "square", "manual"]).default("stripe"),
  metadata: z4.record(z4.string(), z4.any()).optional()
  // Additional payment metadata
});
var updatePaymentStatusSchema = z4.object({
  paymentStatus: z4.enum([
    "pending",
    "processing",
    "completed",
    "failed",
    "refunded",
    "partially_refunded"
  ]),
  transactionId: z4.string().optional(),
  // Optional transaction ID from payment provider
  metadata: z4.record(z4.string(), z4.any()).optional()
  // Additional metadata to merge
});
var processRefundSchema = z4.object({
  amount: z4.number().positive("Refund amount must be positive").optional(),
  // Optional: full refund if not specified
  reason: z4.string().min(3, "Refund reason must be at least 3 characters").optional(),
  metadata: z4.record(z4.string(), z4.any()).optional()
  // Additional refund metadata
});
var webhookEventSchema = z4.object({
  type: z4.enum([
    "payment_intent.succeeded",
    "payment_intent.payment_failed",
    "payment_intent.canceled",
    "charge.refunded",
    "charge.refund.updated"
  ]),
  data: z4.object({
    object: z4.any()
    // Stripe event object - will be validated based on type
  }),
  id: z4.string(),
  created: z4.number()
});

// src/routes/payments.ts
import { zValidator as zValidator3 } from "@hono/zod-validator";
import { nanoid as nanoid4 } from "nanoid";
import Stripe from "stripe";
var app4 = new Hono4();
var stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover"
});
app4.post("/", requireAuth, zValidator3("json", createPaymentSchema), async (c) => {
  try {
    const user2 = c.get("user");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const body = c.req.valid("json");
    const { bookingId, amount, currency, paymentMethod, paymentProvider, metadata } = body;
    const bookingData = await db.select({
      id: bookings.id,
      userId: bookings.userId,
      totalPrice: bookings.totalPrice,
      status: bookings.status,
      startDate: bookings.startDate,
      endDate: bookings.endDate
    }).from(bookings).where(eq5(bookings.id, bookingId)).limit(1);
    if (!bookingData || bookingData.length === 0) {
      return c.json({
        success: false,
        error: "Booking not found"
      }, 404);
    }
    const booking = bookingData[0];
    if (booking.userId !== user2.id) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have permission to create a payment for this booking"
      }, 403);
    }
    if (booking.status === "cancelled") {
      return c.json({
        success: false,
        error: "Cannot create payment for a cancelled booking"
      }, 400);
    }
    const paymentAmount = amount ?? Number(booking.totalPrice);
    if (paymentAmount <= 0) {
      return c.json({
        success: false,
        error: "Payment amount must be greater than zero"
      }, 400);
    }
    if (paymentAmount > Number(booking.totalPrice)) {
      return c.json({
        success: false,
        error: `Payment amount ($${paymentAmount}) cannot exceed booking total ($${booking.totalPrice})`
      }, 400);
    }
    let paymentIntentId = null;
    let clientSecret = null;
    let stripePaymentIntent = null;
    if (paymentProvider === "stripe") {
      try {
        const amountInCents = Math.round(paymentAmount * 100);
        stripePaymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: currency.toLowerCase(),
          payment_method_types: ["card"],
          // Can be extended based on paymentMethod
          metadata: {
            bookingId,
            userId: user2.id,
            ...metadata
          },
          description: `Payment for booking ${bookingId}`
        });
        paymentIntentId = stripePaymentIntent.id;
        clientSecret = stripePaymentIntent.client_secret;
      } catch (stripeError) {
        console.error("Stripe error:", stripeError);
        return c.json({
          success: false,
          error: "Failed to create payment intent with Stripe",
          details: stripeError.message
        }, 500);
      }
    }
    const paymentId = nanoid4();
    const paymentMetadata = {
      ...metadata,
      bookingStartDate: booking.startDate,
      bookingEndDate: booking.endDate
    };
    await db.insert(payments).values({
      id: paymentId,
      bookingId,
      amount: paymentAmount.toString(),
      currency,
      paymentMethod,
      paymentStatus: "pending",
      paymentProvider,
      paymentIntentId,
      transactionId: null,
      // Will be updated when payment is confirmed
      metadata: JSON.stringify(paymentMetadata),
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    });
    return c.json({
      success: true,
      data: {
        payment: {
          id: paymentId,
          bookingId,
          amount: paymentAmount,
          currency,
          paymentMethod,
          paymentStatus: "pending",
          paymentProvider,
          paymentIntentId,
          createdAt: /* @__PURE__ */ new Date()
        },
        // Include client secret for Stripe payments (needed by frontend to complete payment)
        clientSecret,
        // For non-Stripe providers, include relevant session/intent data
        providerData: paymentProvider === "stripe" && stripePaymentIntent ? {
          id: stripePaymentIntent.id,
          status: stripePaymentIntent.status
        } : null
      },
      message: paymentProvider === "stripe" ? "Payment intent created. Use the client secret to complete payment on the frontend." : `Payment initiated with ${paymentProvider}. Please follow the provider's payment flow.`
    }, 201);
  } catch (error) {
    console.error("Error creating payment:", error);
    return c.json({
      success: false,
      error: "Internal server error while creating payment"
    }, 500);
  }
});
app4.get("/:id", requireAuth, async (c) => {
  try {
    const user2 = c.get("user");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const paramsValidation = getPaymentParamsSchema.safeParse({
      id: c.req.param("id")
    });
    if (!paramsValidation.success) {
      return c.json({
        success: false,
        error: "Invalid payment ID",
        details: paramsValidation.error.message
      }, 400);
    }
    const { id: paymentId } = paramsValidation.data;
    const isAdmin = await isUserAdmin(user2.id);
    const paymentData = await db.select({
      // Payment fields
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount,
      currency: payments.currency,
      paymentMethod: payments.paymentMethod,
      paymentStatus: payments.paymentStatus,
      transactionId: payments.transactionId,
      paymentProvider: payments.paymentProvider,
      paymentIntentId: payments.paymentIntentId,
      metadata: payments.metadata,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt,
      // Booking fields (for ownership verification)
      userId: bookings.userId,
      bookingStatus: bookings.status,
      bookingTotalPrice: bookings.totalPrice,
      bookingStartDate: bookings.startDate,
      bookingEndDate: bookings.endDate
    }).from(payments).innerJoin(bookings, eq5(payments.bookingId, bookings.id)).where(eq5(payments.id, paymentId)).limit(1);
    if (!paymentData || paymentData.length === 0) {
      return c.json({
        success: false,
        error: "Payment not found"
      }, 404);
    }
    const payment = paymentData[0];
    if (payment.userId !== user2.id && !isAdmin) {
      return c.json({
        success: false,
        error: "Forbidden - You do not have permission to access this payment"
      }, 403);
    }
    return c.json({
      success: true,
      data: {
        id: payment.id,
        bookingId: payment.bookingId,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        paymentStatus: payment.paymentStatus,
        transactionId: payment.transactionId,
        paymentProvider: payment.paymentProvider,
        paymentIntentId: payment.paymentIntentId,
        metadata: payment.metadata ? JSON.parse(payment.metadata) : null,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        booking: {
          id: payment.bookingId,
          status: payment.bookingStatus,
          totalPrice: payment.bookingTotalPrice,
          startDate: payment.bookingStartDate,
          endDate: payment.bookingEndDate
        }
      }
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return c.json({
      success: false,
      error: "Internal server error while fetching payment"
    }, 500);
  }
});
app4.patch("/:id", requireAuth, zValidator3("json", updatePaymentStatusSchema), async (c) => {
  try {
    const user2 = c.get("user");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const isAdmin = await isUserAdmin(user2.id);
    if (!isAdmin) {
      return c.json({
        success: false,
        error: "Forbidden - Only administrators can update payment status"
      }, 403);
    }
    const paramsValidation = getPaymentParamsSchema.safeParse({
      id: c.req.param("id")
    });
    if (!paramsValidation.success) {
      return c.json({
        success: false,
        error: "Invalid payment ID",
        details: paramsValidation.error.message
      }, 400);
    }
    const { id: paymentId } = paramsValidation.data;
    const body = c.req.valid("json");
    const { paymentStatus, transactionId, metadata } = body;
    const paymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId,
      currentStatus: payments.paymentStatus,
      currentMetadata: payments.metadata,
      bookingStatus: bookings.status
    }).from(payments).innerJoin(bookings, eq5(payments.bookingId, bookings.id)).where(eq5(payments.id, paymentId)).limit(1);
    if (!paymentData || paymentData.length === 0) {
      return c.json({
        success: false,
        error: "Payment not found"
      }, 404);
    }
    const payment = paymentData[0];
    let updatedMetadata = payment.currentMetadata;
    if (metadata) {
      const existingMetadata = payment.currentMetadata ? typeof payment.currentMetadata === "string" ? JSON.parse(payment.currentMetadata) : payment.currentMetadata : {};
      updatedMetadata = JSON.stringify({
        ...existingMetadata,
        ...metadata,
        lastUpdatedBy: user2.id,
        lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const updateData = {
      paymentStatus,
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (transactionId) {
      updateData.transactionId = transactionId;
    }
    if (updatedMetadata) {
      updateData.metadata = updatedMetadata;
    }
    await db.update(payments).set(updateData).where(eq5(payments.id, paymentId));
    let newBookingStatus = null;
    let bookingUpdateMessage = "";
    if (paymentStatus === "completed" && payment.bookingStatus === "pending") {
      newBookingStatus = "confirmed";
      await db.update(bookings).set({
        status: "confirmed",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq5(bookings.id, payment.bookingId));
      bookingUpdateMessage = "Booking status updated to confirmed.";
    } else if (paymentStatus === "refunded" && payment.bookingStatus !== "cancelled") {
      newBookingStatus = "cancelled";
      await db.update(bookings).set({
        status: "cancelled",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq5(bookings.id, payment.bookingId));
      bookingUpdateMessage = "Booking status updated to cancelled due to refund.";
    }
    const updatedPaymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount,
      currency: payments.currency,
      paymentMethod: payments.paymentMethod,
      paymentStatus: payments.paymentStatus,
      transactionId: payments.transactionId,
      paymentProvider: payments.paymentProvider,
      paymentIntentId: payments.paymentIntentId,
      metadata: payments.metadata,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt,
      bookingStatus: bookings.status
    }).from(payments).innerJoin(bookings, eq5(payments.bookingId, bookings.id)).where(eq5(payments.id, paymentId)).limit(1);
    const updatedPayment = updatedPaymentData[0];
    return c.json({
      success: true,
      data: {
        id: updatedPayment.id,
        bookingId: updatedPayment.bookingId,
        amount: updatedPayment.amount,
        currency: updatedPayment.currency,
        paymentMethod: updatedPayment.paymentMethod,
        paymentStatus: updatedPayment.paymentStatus,
        transactionId: updatedPayment.transactionId,
        paymentProvider: updatedPayment.paymentProvider,
        paymentIntentId: updatedPayment.paymentIntentId,
        metadata: updatedPayment.metadata ? JSON.parse(updatedPayment.metadata) : null,
        createdAt: updatedPayment.createdAt,
        updatedAt: updatedPayment.updatedAt,
        booking: {
          id: updatedPayment.bookingId,
          status: updatedPayment.bookingStatus,
          statusChanged: newBookingStatus !== null
        }
      },
      message: bookingUpdateMessage ? `Payment status updated to ${paymentStatus}. ${bookingUpdateMessage}` : `Payment status updated to ${paymentStatus}.`
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return c.json({
      success: false,
      error: "Internal server error while updating payment status"
    }, 500);
  }
});
app4.post("/:id/refund", requireAuth, zValidator3("json", processRefundSchema), async (c) => {
  try {
    const user2 = c.get("user");
    if (!user2 || !user2.id) {
      return c.json({
        success: false,
        error: "User not found in session"
      }, 401);
    }
    const isAdmin = await isUserAdmin(user2.id);
    if (!isAdmin) {
      return c.json({
        success: false,
        error: "Forbidden - Admin access required to process refunds"
      }, 403);
    }
    const paramsValidation = getPaymentParamsSchema.safeParse({
      id: c.req.param("id")
    });
    if (!paramsValidation.success) {
      return c.json({
        success: false,
        error: "Invalid payment ID",
        details: paramsValidation.error.message
      }, 400);
    }
    const { id: paymentId } = paramsValidation.data;
    const body = c.req.valid("json");
    const { amount: refundAmount, reason, metadata } = body;
    const paymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount,
      currency: payments.currency,
      paymentStatus: payments.paymentStatus,
      paymentProvider: payments.paymentProvider,
      paymentIntentId: payments.paymentIntentId,
      transactionId: payments.transactionId,
      metadata: payments.metadata,
      bookingStatus: bookings.status
    }).from(payments).innerJoin(bookings, eq5(payments.bookingId, bookings.id)).where(eq5(payments.id, paymentId)).limit(1);
    if (!paymentData || paymentData.length === 0) {
      return c.json({
        success: false,
        error: "Payment not found"
      }, 404);
    }
    const payment = paymentData[0];
    if (payment.paymentStatus !== "completed" && payment.paymentStatus !== "partially_refunded") {
      return c.json({
        success: false,
        error: `Cannot refund payment with status: ${payment.paymentStatus}. Only completed or partially refunded payments can be refunded.`
      }, 400);
    }
    const paymentAmountNum = Number(payment.amount);
    const refundAmountNum = refundAmount ?? paymentAmountNum;
    if (refundAmountNum <= 0) {
      return c.json({
        success: false,
        error: "Refund amount must be greater than zero"
      }, 400);
    }
    if (refundAmountNum > paymentAmountNum) {
      return c.json({
        success: false,
        error: `Refund amount ($${refundAmountNum}) cannot exceed payment amount ($${paymentAmountNum})`
      }, 400);
    }
    let refundId = null;
    let refundStatus = "succeeded";
    let providerRefundData = null;
    if (payment.paymentProvider === "stripe" && payment.paymentIntentId) {
      try {
        const refundAmountInCents = Math.round(refundAmountNum * 100);
        const refund = await stripe.refunds.create({
          payment_intent: payment.paymentIntentId,
          amount: refundAmountInCents,
          reason: reason ? "requested_by_customer" : void 0,
          metadata: {
            paymentId: payment.id,
            bookingId: payment.bookingId,
            refundReason: reason || "No reason provided",
            processedBy: user2.id,
            ...metadata
          }
        });
        refundId = refund.id;
        refundStatus = refund.status ?? "pending";
        providerRefundData = {
          id: refund.id,
          status: refund.status,
          amount: refund.amount / 100,
          currency: refund.currency,
          created: refund.created
        };
      } catch (stripeError) {
        console.error("Stripe refund error:", stripeError);
        return c.json({
          success: false,
          error: "Failed to process refund with Stripe",
          details: stripeError.message
        }, 500);
      }
    } else if (payment.paymentProvider !== "stripe") {
      refundId = `refund_${nanoid4()}`;
      console.log(`Manual refund required for ${payment.paymentProvider} provider: ${refundId}`);
    } else {
      return c.json({
        success: false,
        error: "Cannot process refund - payment intent ID not found"
      }, 400);
    }
    const isFullRefund = refundAmountNum >= paymentAmountNum;
    const newPaymentStatus = isFullRefund ? "refunded" : "partially_refunded";
    const existingMetadata = payment.metadata ? typeof payment.metadata === "string" ? JSON.parse(payment.metadata) : payment.metadata : {};
    const refunds = existingMetadata.refunds || [];
    refunds.push({
      refundId,
      amount: refundAmountNum,
      reason: reason || "No reason provided",
      processedBy: user2.id,
      processedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: refundStatus,
      ...metadata
    });
    const updatedMetadata = JSON.stringify({
      ...existingMetadata,
      refunds,
      totalRefunded: refunds.reduce((sum, r) => sum + r.amount, 0),
      lastRefundDate: (/* @__PURE__ */ new Date()).toISOString()
    });
    await db.update(payments).set({
      paymentStatus: newPaymentStatus,
      metadata: updatedMetadata,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(payments.id, paymentId));
    let bookingUpdateMessage = "";
    if (isFullRefund && payment.bookingStatus !== "cancelled") {
      await db.update(bookings).set({
        status: "cancelled",
        updatedAt: /* @__PURE__ */ new Date()
      }).where(eq5(bookings.id, payment.bookingId));
      bookingUpdateMessage = " Booking has been cancelled due to full refund.";
    }
    const updatedPaymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount,
      currency: payments.currency,
      paymentMethod: payments.paymentMethod,
      paymentStatus: payments.paymentStatus,
      transactionId: payments.transactionId,
      paymentProvider: payments.paymentProvider,
      paymentIntentId: payments.paymentIntentId,
      metadata: payments.metadata,
      createdAt: payments.createdAt,
      updatedAt: payments.updatedAt,
      bookingStatus: bookings.status
    }).from(payments).innerJoin(bookings, eq5(payments.bookingId, bookings.id)).where(eq5(payments.id, paymentId)).limit(1);
    const updatedPayment = updatedPaymentData[0];
    const parsedMetadata = updatedPayment.metadata ? JSON.parse(updatedPayment.metadata) : null;
    return c.json({
      success: true,
      data: {
        payment: {
          id: updatedPayment.id,
          bookingId: updatedPayment.bookingId,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          paymentMethod: updatedPayment.paymentMethod,
          paymentStatus: updatedPayment.paymentStatus,
          transactionId: updatedPayment.transactionId,
          paymentProvider: updatedPayment.paymentProvider,
          paymentIntentId: updatedPayment.paymentIntentId,
          metadata: parsedMetadata,
          createdAt: updatedPayment.createdAt,
          updatedAt: updatedPayment.updatedAt
        },
        refund: {
          refundId,
          amount: refundAmountNum,
          currency: payment.currency,
          status: refundStatus,
          isFullRefund,
          reason: reason || "No reason provided",
          providerData: providerRefundData
        },
        booking: {
          id: updatedPayment.bookingId,
          status: updatedPayment.bookingStatus
        }
      },
      message: `${isFullRefund ? "Full" : "Partial"} refund of $${refundAmountNum} processed successfully.${bookingUpdateMessage}`
    }, 200);
  } catch (error) {
    console.error("Error processing refund:", error);
    return c.json({
      success: false,
      error: "Internal server error while processing refund"
    }, 500);
  }
});
app4.post("/webhooks/payment", async (c) => {
  try {
    const signature = c.req.header("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!signature) {
      console.error("No Stripe signature found in webhook request");
      return c.json({
        success: false,
        error: "No signature provided"
      }, 400);
    }
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return c.json({
        success: false,
        error: "Webhook secret not configured"
      }, 500);
    }
    const rawBody = await c.req.text();
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return c.json({
        success: false,
        error: "Invalid signature"
      }, 400);
    }
    console.log(`Received webhook event: ${event.type}`);
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        await handlePaymentCanceled(paymentIntent);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        await handleRefund(charge);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    return c.json({
      success: true,
      message: "Webhook processed successfully"
    }, 200);
  } catch (error) {
    console.error("Error processing webhook:", error);
    return c.json({
      success: false,
      error: "Internal server error while processing webhook"
    }, 500);
  }
});
async function handlePaymentSuccess(paymentIntent) {
  try {
    const paymentIntentId = paymentIntent.id;
    const transactionId = paymentIntent.latest_charge;
    console.log(`Processing successful payment: ${paymentIntentId}`);
    const paymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount
    }).from(payments).where(eq5(payments.paymentIntentId, paymentIntentId)).limit(1);
    if (!paymentData || paymentData.length === 0) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntentId}`);
      return;
    }
    const payment = paymentData[0];
    await db.update(payments).set({
      paymentStatus: "completed",
      transactionId,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(payments.id, payment.id));
    console.log(`Payment ${payment.id} marked as completed`);
    const bookingPayments = await db.select({
      amount: payments.amount,
      paymentStatus: payments.paymentStatus
    }).from(payments).where(eq5(payments.bookingId, payment.bookingId));
    const totalPaid = bookingPayments.filter((p) => p.paymentStatus === "completed").reduce((sum, p) => sum + Number(p.amount), 0);
    const bookingData = await db.select({
      totalPrice: bookings.totalPrice,
      status: bookings.status
    }).from(bookings).where(eq5(bookings.id, payment.bookingId)).limit(1);
    if (bookingData && bookingData.length > 0) {
      const booking = bookingData[0];
      const bookingTotal = Number(booking.totalPrice);
      if (totalPaid >= bookingTotal && booking.status === "pending") {
        await db.update(bookings).set({
          status: "confirmed",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq5(bookings.id, payment.bookingId));
        console.log(`Booking ${payment.bookingId} confirmed - fully paid`);
      }
    }
  } catch (error) {
    console.error("Error handling payment success:", error);
    throw error;
  }
}
async function handlePaymentFailed(paymentIntent) {
  try {
    const paymentIntentId = paymentIntent.id;
    console.log(`Processing failed payment: ${paymentIntentId}`);
    const paymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId
    }).from(payments).where(eq5(payments.paymentIntentId, paymentIntentId)).limit(1);
    if (!paymentData || paymentData.length === 0) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntentId}`);
      return;
    }
    const payment = paymentData[0];
    await db.update(payments).set({
      paymentStatus: "failed",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(payments.id, payment.id));
    console.log(`Payment ${payment.id} marked as failed`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}
async function handlePaymentCanceled(paymentIntent) {
  try {
    const paymentIntentId = paymentIntent.id;
    console.log(`Processing canceled payment: ${paymentIntentId}`);
    const paymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId
    }).from(payments).where(eq5(payments.paymentIntentId, paymentIntentId)).limit(1);
    if (!paymentData || paymentData.length === 0) {
      console.error(`Payment not found for PaymentIntent: ${paymentIntentId}`);
      return;
    }
    const payment = paymentData[0];
    await db.update(payments).set({
      paymentStatus: "failed",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(payments.id, payment.id));
    console.log(`Payment ${payment.id} marked as failed (canceled)`);
  } catch (error) {
    console.error("Error handling payment cancellation:", error);
    throw error;
  }
}
async function handleRefund(charge) {
  try {
    const chargeId = charge.id;
    console.log(`Processing refund for charge: ${chargeId}`);
    const paymentData = await db.select({
      id: payments.id,
      bookingId: payments.bookingId,
      amount: payments.amount
    }).from(payments).where(eq5(payments.transactionId, chargeId)).limit(1);
    if (!paymentData || paymentData.length === 0) {
      console.error(`Payment not found for charge: ${chargeId}`);
      return;
    }
    const payment = paymentData[0];
    const paymentAmount = Number(payment.amount);
    const refundedAmount = charge.amount_refunded / 100;
    const isFullRefund = refundedAmount >= paymentAmount;
    await db.update(payments).set({
      paymentStatus: isFullRefund ? "refunded" : "partially_refunded",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(payments.id, payment.id));
    console.log(`Payment ${payment.id} marked as ${isFullRefund ? "refunded" : "partially_refunded"}`);
    if (isFullRefund) {
      const bookingPayments = await db.select({
        paymentStatus: payments.paymentStatus
      }).from(payments).where(eq5(payments.bookingId, payment.bookingId));
      const allRefunded = bookingPayments.every(
        (p) => p.paymentStatus === "refunded" || p.paymentStatus === "failed"
      );
      if (allRefunded) {
        await db.update(bookings).set({
          status: "cancelled",
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq5(bookings.id, payment.bookingId));
        console.log(`Booking ${payment.bookingId} cancelled - all payments refunded`);
      }
    }
  } catch (error) {
    console.error("Error handling refund:", error);
    throw error;
  }
}
var payments_default = app4;

// src/routes/reviews.ts
import { Hono as Hono5 } from "hono";
import { eq as eq6, sql as sql4, and as and4 } from "drizzle-orm";

// src/routes/reviews.validation.ts
import { z as z5 } from "zod";
var createReviewSchema = z5.object({
  bookingActivityId: z5.string().min(1, "Booking activity ID is required"),
  rating: z5.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z5.string().optional()
});
var updateReviewSchema = z5.object({
  rating: z5.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
  comment: z5.string().optional()
}).refine(
  (data) => data.rating !== void 0 || data.comment !== void 0,
  {
    message: "At least one field (rating or comment) must be provided"
  }
);

// src/routes/reviews.ts
import { zValidator as zValidator4 } from "@hono/zod-validator";
import { nanoid as nanoid5 } from "nanoid";
var app5 = new Hono5();
app5.get("/", async (c) => {
  try {
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const offset = (page - 1) * limit;
    const reviewsData = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        image: user.image
      },
      activity: {
        id: activities.id,
        name: activities.name,
        location: activities.location
      }
    }).from(reviews).innerJoin(user, eq6(reviews.userId, user.id)).innerJoin(bookingActivities, eq6(reviews.bookingActivityId, bookingActivities.id)).innerJoin(activities, eq6(bookingActivities.activityId, activities.id)).orderBy(reviews.createdAt).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql4`count(*)::int` }).from(reviews);
    const totalPages = Math.ceil(count / limit);
    return c.json({
      success: true,
      data: reviewsData,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch reviews"
      },
      500
    );
  }
});
app5.get("/me", requireAuth, async (c) => {
  try {
    const authUser = c.get("user");
    if (!authUser || !authUser.id) {
      return c.json(
        {
          success: false,
          error: "User not authenticated"
        },
        401
      );
    }
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const offset = (page - 1) * limit;
    const userReviews = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      activity: {
        id: activities.id,
        name: activities.name,
        description: activities.description,
        location: activities.location,
        durationMinutes: activities.durationMinutes,
        price: activities.price
      },
      bookingActivity: {
        id: bookingActivities.id,
        bookingId: bookingActivities.bookingId,
        scheduledAt: bookingActivities.scheduledAt,
        priceAtBooking: bookingActivities.priceAtBooking
      }
    }).from(reviews).innerJoin(bookingActivities, eq6(reviews.bookingActivityId, bookingActivities.id)).innerJoin(activities, eq6(bookingActivities.activityId, activities.id)).where(eq6(reviews.userId, authUser.id)).orderBy(reviews.createdAt).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql4`count(*)::int` }).from(reviews).where(eq6(reviews.userId, authUser.id));
    const totalPages = Math.ceil(count / limit);
    return c.json({
      success: true,
      data: userReviews,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch user reviews"
      },
      500
    );
  }
});
app5.get("/:id", async (c) => {
  try {
    const reviewId = c.req.param("id");
    const reviewData = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      bookingActivityId: reviews.bookingActivityId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      activity: {
        id: activities.id,
        name: activities.name,
        description: activities.description,
        location: activities.location,
        durationMinutes: activities.durationMinutes
      },
      bookingActivity: {
        id: bookingActivities.id,
        bookingId: bookingActivities.bookingId,
        scheduledAt: bookingActivities.scheduledAt,
        priceAtBooking: bookingActivities.priceAtBooking
      }
    }).from(reviews).innerJoin(user, eq6(reviews.userId, user.id)).innerJoin(bookingActivities, eq6(reviews.bookingActivityId, bookingActivities.id)).innerJoin(activities, eq6(bookingActivities.activityId, activities.id)).where(eq6(reviews.id, reviewId)).limit(1);
    if (!reviewData || reviewData.length === 0) {
      return c.json(
        {
          success: false,
          error: "Review not found"
        },
        404
      );
    }
    return c.json({
      success: true,
      data: reviewData[0]
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch review"
      },
      500
    );
  }
});
app5.post("/", requireAuth, zValidator4("json", createReviewSchema), async (c) => {
  try {
    const authUser = c.get("user");
    if (!authUser || !authUser.id) {
      return c.json(
        {
          success: false,
          error: "User not authenticated"
        },
        401
      );
    }
    const body = c.req.valid("json");
    const bookingActivityData = await db.select({
      bookingActivity: {
        id: bookingActivities.id,
        bookingId: bookingActivities.bookingId,
        activityId: bookingActivities.activityId
      },
      booking: {
        id: bookings.id,
        userId: bookings.userId,
        status: bookings.status
      }
    }).from(bookingActivities).innerJoin(bookings, eq6(bookingActivities.bookingId, bookings.id)).where(eq6(bookingActivities.id, body.bookingActivityId)).limit(1);
    if (!bookingActivityData || bookingActivityData.length === 0) {
      return c.json(
        {
          success: false,
          error: "Booking activity not found"
        },
        404
      );
    }
    const { booking } = bookingActivityData[0];
    if (booking.userId !== authUser.id) {
      return c.json(
        {
          success: false,
          error: "You can only review your own bookings"
        },
        403
      );
    }
    if (booking.status !== "completed") {
      return c.json(
        {
          success: false,
          error: "You can only review completed activities"
        },
        400
      );
    }
    const existingReview = await db.select({ id: reviews.id }).from(reviews).where(
      and4(
        eq6(reviews.bookingActivityId, body.bookingActivityId),
        eq6(reviews.userId, authUser.id)
      )
    ).limit(1);
    if (existingReview && existingReview.length > 0) {
      return c.json(
        {
          success: false,
          error: "You have already reviewed this activity"
        },
        400
      );
    }
    const reviewId = nanoid5();
    const [newReview] = await db.insert(reviews).values({
      id: reviewId,
      bookingActivityId: body.bookingActivityId,
      userId: authUser.id,
      rating: body.rating,
      comment: body.comment || null,
      isVerified: true
      // Set to true as per requirements
    }).returning();
    const reviewData = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      bookingActivityId: reviews.bookingActivityId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      activity: {
        id: activities.id,
        name: activities.name,
        description: activities.description,
        location: activities.location,
        durationMinutes: activities.durationMinutes
      },
      bookingActivity: {
        id: bookingActivities.id,
        bookingId: bookingActivities.bookingId,
        scheduledAt: bookingActivities.scheduledAt,
        priceAtBooking: bookingActivities.priceAtBooking
      }
    }).from(reviews).innerJoin(user, eq6(reviews.userId, user.id)).innerJoin(bookingActivities, eq6(reviews.bookingActivityId, bookingActivities.id)).innerJoin(activities, eq6(bookingActivities.activityId, activities.id)).where(eq6(reviews.id, reviewId)).limit(1);
    return c.json(
      {
        success: true,
        message: "Review created successfully",
        data: reviewData[0]
      },
      201
    );
  } catch (error) {
    console.error("Error creating review:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create review"
      },
      500
    );
  }
});
app5.patch("/:id", requireAuth, zValidator4("json", updateReviewSchema), async (c) => {
  try {
    const authUser = c.get("user");
    if (!authUser || !authUser.id) {
      return c.json(
        {
          success: false,
          error: "User not authenticated"
        },
        401
      );
    }
    const reviewId = c.req.param("id");
    const body = c.req.valid("json");
    const existingReview = await db.select({
      id: reviews.id,
      userId: reviews.userId
    }).from(reviews).where(eq6(reviews.id, reviewId)).limit(1);
    if (!existingReview || existingReview.length === 0) {
      return c.json(
        {
          success: false,
          error: "Review not found"
        },
        404
      );
    }
    if (existingReview[0].userId !== authUser.id) {
      return c.json(
        {
          success: false,
          error: "You can only update your own reviews"
        },
        403
      );
    }
    await db.update(reviews).set({
      ...body.rating !== void 0 && { rating: body.rating },
      ...body.comment !== void 0 && { comment: body.comment },
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq6(reviews.id, reviewId));
    const reviewData = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      bookingActivityId: reviews.bookingActivityId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      activity: {
        id: activities.id,
        name: activities.name,
        description: activities.description,
        location: activities.location,
        durationMinutes: activities.durationMinutes
      },
      bookingActivity: {
        id: bookingActivities.id,
        bookingId: bookingActivities.bookingId,
        scheduledAt: bookingActivities.scheduledAt,
        priceAtBooking: bookingActivities.priceAtBooking
      }
    }).from(reviews).innerJoin(user, eq6(reviews.userId, user.id)).innerJoin(bookingActivities, eq6(reviews.bookingActivityId, bookingActivities.id)).innerJoin(activities, eq6(bookingActivities.activityId, activities.id)).where(eq6(reviews.id, reviewId)).limit(1);
    return c.json({
      success: true,
      message: "Review updated successfully",
      data: reviewData[0]
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update review"
      },
      500
    );
  }
});
app5.delete("/:id", requireAuth, async (c) => {
  try {
    const authUser = c.get("user");
    if (!authUser || !authUser.id) {
      return c.json(
        {
          success: false,
          error: "User not authenticated"
        },
        401
      );
    }
    const reviewId = c.req.param("id");
    const existingReview = await db.select({
      id: reviews.id,
      userId: reviews.userId
    }).from(reviews).where(eq6(reviews.id, reviewId)).limit(1);
    if (!existingReview || existingReview.length === 0) {
      return c.json(
        {
          success: false,
          error: "Review not found"
        },
        404
      );
    }
    const isAdmin = await isUserAdmin(authUser.id);
    const isOwner = existingReview[0].userId === authUser.id;
    if (!isOwner && !isAdmin) {
      return c.json(
        {
          success: false,
          error: "You can only delete your own reviews"
        },
        403
      );
    }
    await db.delete(reviews).where(eq6(reviews.id, reviewId));
    return c.json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return c.json(
      {
        success: false,
        error: "Failed to delete review"
      },
      500
    );
  }
});
var reviews_default = app5;

// src/routes/guides.ts
import { Hono as Hono6 } from "hono";
import { and as and5, eq as eq7, like as like2, sql as sql5, avg as avg2, gte as gte2, lte as lte2 } from "drizzle-orm";
import { zValidator as zValidator5 } from "@hono/zod-validator";

// src/routes/guides.validation.ts
import { z as z6 } from "zod";
var listGuidesQuerySchema = z6.object({
  page: z6.string().optional().default("1"),
  limit: z6.string().optional().default("10"),
  is_active: z6.enum(["true", "false"]).optional(),
  specialties: z6.string().optional()
  // Comma-separated specialties to filter by
});
var createGuideSchema = z6.object({
  name: z6.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  email: z6.string().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z6.string().max(50, "Phone number must be less than 50 characters").optional().nullable(),
  bio: z6.string().max(2e3, "Bio must be less than 2000 characters").optional().nullable(),
  specialties: z6.string().max(500, "Specialties must be less than 500 characters").optional().nullable(),
  imageUrl: z6.string().url("Invalid image URL").optional().nullable(),
  isActive: z6.boolean().optional().default(true)
});
var updateGuideSchema = z6.object({
  name: z6.string().min(1, "Name cannot be empty").max(255, "Name must be less than 255 characters").optional(),
  email: z6.string().email("Invalid email address").max(255, "Email must be less than 255 characters").optional(),
  phone: z6.string().max(50, "Phone number must be less than 50 characters").optional().nullable(),
  bio: z6.string().max(2e3, "Bio must be less than 2000 characters").optional().nullable(),
  specialties: z6.string().max(500, "Specialties must be less than 500 characters").optional().nullable(),
  imageUrl: z6.string().url("Invalid image URL").optional().nullable(),
  isActive: z6.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

// src/routes/guides.ts
import { nanoid as nanoid6 } from "nanoid";
var app6 = new Hono6();
app6.get("/", async (c) => {
  try {
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const isActiveParam = c.req.query("is_active");
    const specialtiesParam = c.req.query("specialties");
    const conditions = [];
    if (isActiveParam !== void 0) {
      const isActive = isActiveParam === "true";
      conditions.push(eq7(guides.isActive, isActive));
    }
    if (specialtiesParam) {
      const specialtyList = specialtiesParam.split(",").map((s) => s.trim());
      const specialtyConditions = specialtyList.map(
        (specialty) => like2(guides.specialties, `%${specialty}%`)
      );
      if (specialtyConditions.length > 0) {
        conditions.push(
          specialtyConditions.length === 1 ? specialtyConditions[0] : sql5`${guides.specialties} ILIKE ANY(ARRAY[${sql5.join(
            specialtyList.map((s) => sql5`${"%" + s + "%"}`),
            sql5`, `
          )}])`
        );
      }
    }
    const offset = (page - 1) * limit;
    const whereClause = conditions.length > 0 ? and5(...conditions) : void 0;
    const guidesList = await db.select().from(guides).where(whereClause).limit(limit).offset(offset).orderBy(guides.name);
    const [{ count }] = await db.select({ count: sql5`count(*)::int` }).from(guides).where(whereClause);
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    return c.json({
      data: guidesList,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage,
        hasPreviousPage
      }
    });
  } catch (error) {
    console.error("Error fetching guides:", error);
    return c.json(
      {
        error: "Failed to fetch guides",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});
app6.get("/:id", async (c) => {
  try {
    const guideId = c.req.param("id");
    const [guide] = await db.select().from(guides).where(eq7(guides.id, guideId)).limit(1);
    if (!guide) {
      return c.json(
        {
          success: false,
          error: "Guide not found"
        },
        404
      );
    }
    return c.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error("Error fetching guide:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch guide",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});
app6.get("/:id/availability", async (c) => {
  try {
    const guideId = c.req.param("id");
    const startDate = c.req.query("startDate");
    const endDate = c.req.query("endDate");
    if (!startDate || !endDate) {
      return c.json(
        {
          success: false,
          error: "Both startDate and endDate are required"
        },
        400
      );
    }
    const [guide] = await db.select().from(guides).where(eq7(guides.id, guideId)).limit(1);
    if (!guide) {
      return c.json(
        {
          success: false,
          error: "Guide not found"
        },
        404
      );
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return c.json(
        {
          success: false,
          error: "Invalid date format. Use ISO format (YYYY-MM-DD)"
        },
        400
      );
    }
    if (start > end) {
      return c.json(
        {
          success: false,
          error: "startDate must be before endDate"
        },
        400
      );
    }
    const scheduledActivities = await db.select({
      bookingActivityId: bookingActivities.id,
      scheduledAt: bookingActivities.scheduledAt,
      activity: {
        id: activities.id,
        name: activities.name,
        durationMinutes: activities.durationMinutes
      }
    }).from(bookingActivities).innerJoin(activities, eq7(bookingActivities.activityId, activities.id)).where(
      and5(
        eq7(bookingActivities.guideId, guideId),
        gte2(bookingActivities.scheduledAt, start),
        lte2(bookingActivities.scheduledAt, end)
      )
    ).orderBy(bookingActivities.scheduledAt);
    const timeSlots = scheduledActivities.map((slot) => {
      const scheduledTime = slot.scheduledAt;
      if (!scheduledTime) return null;
      const endTime = new Date(scheduledTime);
      endTime.setMinutes(endTime.getMinutes() + slot.activity.durationMinutes);
      return {
        bookingActivityId: slot.bookingActivityId,
        activityName: slot.activity.name,
        startTime: scheduledTime,
        endTime,
        durationMinutes: slot.activity.durationMinutes,
        status: "unavailable"
      };
    }).filter(Boolean);
    return c.json({
      success: true,
      data: {
        guide: {
          id: guide.id,
          name: guide.name,
          isActive: guide.isActive
        },
        dateRange: {
          startDate: start,
          endDate: end
        },
        scheduledActivities: timeSlots,
        totalScheduled: timeSlots.length,
        isAvailable: timeSlots.length === 0
        // Simple availability check
      }
    });
  } catch (error) {
    console.error("Error fetching guide availability:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch guide availability",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});
app6.get("/:id/reviews", async (c) => {
  try {
    const guideId = c.req.param("id");
    const page = Math.max(1, Number.parseInt(c.req.query("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(c.req.query("limit") || "10"))
    );
    const [guide] = await db.select({ id: guides.id, name: guides.name }).from(guides).where(eq7(guides.id, guideId)).limit(1);
    if (!guide) {
      return c.json(
        {
          success: false,
          error: "Guide not found"
        },
        404
      );
    }
    const offset = (page - 1) * limit;
    const reviewsData = await db.select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      isVerified: reviews.isVerified,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      user: {
        id: user.id,
        name: user.name,
        image: user.image
      },
      activity: {
        id: activities.id,
        name: activities.name,
        location: activities.location
      }
    }).from(reviews).innerJoin(bookingActivities, eq7(reviews.bookingActivityId, bookingActivities.id)).innerJoin(user, eq7(reviews.userId, user.id)).innerJoin(activities, eq7(bookingActivities.activityId, activities.id)).where(eq7(bookingActivities.guideId, guideId)).orderBy(reviews.createdAt).limit(limit).offset(offset);
    const [{ count }] = await db.select({ count: sql5`count(*)::int` }).from(reviews).innerJoin(bookingActivities, eq7(reviews.bookingActivityId, bookingActivities.id)).where(eq7(bookingActivities.guideId, guideId));
    const [{ avgRating }] = await db.select({ avgRating: avg2(reviews.rating) }).from(reviews).innerJoin(bookingActivities, eq7(reviews.bookingActivityId, bookingActivities.id)).where(eq7(bookingActivities.guideId, guideId));
    const totalPages = Math.ceil(count / limit);
    const averageRating = avgRating ? Number.parseFloat(avgRating) : 0;
    return c.json({
      success: true,
      data: {
        guide: {
          id: guide.id,
          name: guide.name
        },
        reviews: reviewsData,
        averageRating: Math.round(averageRating * 10) / 10,
        // Round to 1 decimal place
        totalReviews: count
      },
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching guide reviews:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch guide reviews",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});
app6.post("/", requireAdmin, zValidator5("json", createGuideSchema), async (c) => {
  try {
    const body = c.req.valid("json");
    const guideId = nanoid6();
    const existingGuide = await db.select({ id: guides.id }).from(guides).where(eq7(guides.email, body.email.toLowerCase())).limit(1);
    if (existingGuide.length > 0) {
      return c.json(
        {
          success: false,
          error: "A guide with this email already exists"
        },
        409
      );
    }
    const [newGuide] = await db.insert(guides).values({
      id: guideId,
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone?.trim() || null,
      bio: body.bio?.trim() || null,
      specialties: body.specialties?.trim() || null,
      imageUrl: body.imageUrl?.trim() || null,
      isActive: body.isActive ?? true
    }).returning();
    return c.json(
      {
        success: true,
        message: "Guide created successfully",
        data: newGuide
      },
      201
    );
  } catch (error) {
    console.error("Error creating guide:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create guide",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});
app6.patch("/:id", requireAdmin, zValidator5("json", updateGuideSchema), async (c) => {
  try {
    const guideId = c.req.param("id");
    const body = c.req.valid("json");
    const [existingGuide] = await db.select().from(guides).where(eq7(guides.id, guideId)).limit(1);
    if (!existingGuide) {
      return c.json(
        {
          success: false,
          error: "Guide not found"
        },
        404
      );
    }
    if (body.email && body.email.toLowerCase() !== existingGuide.email) {
      const emailExists = await db.select({ id: guides.id }).from(guides).where(eq7(guides.email, body.email.toLowerCase())).limit(1);
      if (emailExists.length > 0) {
        return c.json(
          {
            success: false,
            error: "A guide with this email already exists"
          },
          409
        );
      }
    }
    const updateData = {};
    if (body.name !== void 0) {
      updateData.name = body.name.trim();
    }
    if (body.email !== void 0) {
      updateData.email = body.email.toLowerCase().trim();
    }
    if (body.phone !== void 0) {
      updateData.phone = body.phone?.trim() || null;
    }
    if (body.bio !== void 0) {
      updateData.bio = body.bio?.trim() || null;
    }
    if (body.specialties !== void 0) {
      updateData.specialties = body.specialties?.trim() || null;
    }
    if (body.imageUrl !== void 0) {
      updateData.imageUrl = body.imageUrl?.trim() || null;
    }
    if (body.isActive !== void 0) {
      updateData.isActive = body.isActive;
    }
    const [updatedGuide] = await db.update(guides).set(updateData).where(eq7(guides.id, guideId)).returning();
    return c.json({
      success: true,
      message: "Guide updated successfully",
      data: updatedGuide
    });
  } catch (error) {
    console.error("Error updating guide:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update guide",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});
app6.patch("/:id/deactivate", requireAdmin, async (c) => {
  try {
    const guideId = c.req.param("id");
    const [existingGuide] = await db.select().from(guides).where(eq7(guides.id, guideId)).limit(1);
    if (!existingGuide) {
      return c.json(
        {
          success: false,
          error: "Guide not found"
        },
        404
      );
    }
    if (!existingGuide.isActive) {
      return c.json(
        {
          success: true,
          message: "Guide is already deactivated",
          data: existingGuide
        },
        200
      );
    }
    const [deactivatedGuide] = await db.update(guides).set({ isActive: false }).where(eq7(guides.id, guideId)).returning();
    return c.json({
      success: true,
      message: "Guide deactivated successfully",
      data: deactivatedGuide
    });
  } catch (error) {
    console.error("Error deactivating guide:", error);
    return c.json(
      {
        success: false,
        error: "Failed to deactivate guide",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      500
    );
  }
});
var guides_default = app6;

// src/index.ts
var app7 = new Hono7();
var allowedOrigins = process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3001", "http://localhost:3000"];
app7.use("*", cors({
  origin: allowedOrigins,
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"]
}));
app7.all("/api/auth/*", async (c) => {
  return await auth.handler(c.req.raw);
}).route("/api/webhooks", payments_default).route("/api/activities", activities_default).route("/api/packages", packages_default).route("/api/bookings", bookings_default).route("/api/payments", payments_default).route("/api/reviews", reviews_default).route("/api/guides", guides_default).get("/", (c) => {
  return c.text("Hello Hono!");
});
var src_default = app7;

// api/index.ts
var index_default = handle(src_default);
export {
  index_default as default
};
//# sourceMappingURL=index.js.map