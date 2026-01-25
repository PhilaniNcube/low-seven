"use server";

import { z } from "zod";
import { cookies } from "next/headers";

/**
 * Schema for creating a new activity
 * Matches the API validation schema
 */
const createActivitySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional().nullable(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  location: z.string().min(1, "Location is required").max(255, "Location must be less than 255 characters"),
  durationMinutes: z.coerce.number().int("Duration must be an integer").positive("Duration must be positive"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

export type CreateActivityState = {
  errors?: {
    name?: string[];
    description?: string[];
    imageUrl?: string[];
    location?: string[];
    durationMinutes?: string[];
    price?: string[];
  };
  message?: string;
  success?: boolean;
  data?: CreateActivityInput;
};

export async function createActivityAction(
  prevState: CreateActivityState,
  formData: FormData
): Promise<CreateActivityState> {
  // Extract form data
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description") || null,
    imageUrl: formData.get("imageUrl") || null,
    location: formData.get("location"),
    durationMinutes: formData.get("durationMinutes"),
    price: formData.get("price"),
  };

  // Validate the form data
  const validatedFields = createActivitySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }


  try {
    // Get cookies from the request to forward authentication
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Make API request to create activity
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/api/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookieHeader,
      },
      body: JSON.stringify(validatedFields.data),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        message: result.error || "Failed to create activity",
        success: false,
      };
    }

    return {
      success: true,
      message: "Activity created successfully",
      data: validatedFields.data,
    };
  } catch (error) {
    console.error("Error creating activity:", error);
    return {
      message: "An unexpected error occurred",
      success: false,
    };
  }
}
