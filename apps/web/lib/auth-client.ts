import { createAuthClient } from "better-auth/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  console.warn(
    "⚠️ NEXT_PUBLIC_API_URL is not set. Falling back to localhost:3000. " +
    "This will cause issues in production. Please set NEXT_PUBLIC_API_URL in your environment variables."
  );
} else {
  console.log("[Auth Client] Using API URL:", apiUrl);
}

// Increase timeout and add better error handling
export const authClient = createAuthClient({
  baseURL: apiUrl || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
    // Custom fetch with timeout and better error handling
    onRequest: async (context) => {
      console.log("[Auth Client] Making request to:", context.url);
    },
    onSuccess: async (context) => {
      console.log("[Auth Client] Request successful:", context.response.status);
      console.log("[Auth Client] Response headers:", Object.fromEntries(context.response.headers.entries()));
    },
    onError: async (context) => {
      console.error("[Auth Client] Request failed:", {
        error: context.error,
        response: context.response,
        status: context.response?.status,
      });
    },
  },
});

export const { signUp, signIn, signOut, useSession } = authClient;
