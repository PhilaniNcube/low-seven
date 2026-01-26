"use server";

import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
  data?: {
    email: string;
    password: string;
  };
};

export type SignUpState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
  success?: boolean;
  data?: {
    name: string;
    email: string;
    password: string;
  };
};

export async function signInAction(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const validatedFields = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  // Return validated data to be used on the client side
  return {
    success: true,
    data: validatedFields.data,
  };
}

export async function signUpAction(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const validatedFields = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your inputs.",
    };
  }

  // Call the signup API endpoint
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.error || "Failed to create account",
      };
    }

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    console.error("Sign-up error:", error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
