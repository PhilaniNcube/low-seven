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

export const authClient = createAuthClient({
  baseURL: apiUrl || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signUp, signIn, signOut, useSession } = authClient;
