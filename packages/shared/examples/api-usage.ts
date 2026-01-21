// Example: Using shared types in API routes

import { Hono } from "hono";
import type { 
  ApiResponse, 
  Activity, 
  CreateActivityRequest,
  PaginatedResponse 
} from "@low-seven/shared/api";

const app = new Hono();

// Example GET endpoint with typed response
app.get("/api/activities", async (c) => {
  // Your database query here
  const activities: Activity[] = [
    // ... query results
  ];

  const response: ApiResponse<PaginatedResponse<Activity>> = {
    success: true,
    data: {
      items: activities,
      pagination: {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10
      }
    }
  };

  return c.json(response);
});

// Example POST endpoint with typed request body
app.post("/api/activities", async (c) => {
  const body = await c.req.json() as CreateActivityRequest;
  
  // Validate and create activity
  const newActivity: Activity = {
      id: "",
      name: "",
      description: null,
      imageUrl: null,
      location: "",
      durationMinutes: 0,
      price: "",
      createdAt: new Date(),
      updatedAt: new Date()
  };

  const response: ApiResponse<Activity> = {
    success: true,
    data: newActivity,
    message: "Activity created successfully"
  };

  return c.json(response);
});

// Example error response
app.get("/api/activities/:id", async (c) => {
  const id = c.req.param("id");
  
  // If not found
  const errorResponse: ApiResponse<never> = {
    success: false,
    error: "Activity not found"
  };

  return c.json(errorResponse, 404);
});

export default app;
