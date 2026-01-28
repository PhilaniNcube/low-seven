"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState, useTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInAction, type SignInState } from "@/actions/auth";
import { signIn } from "@/lib/auth-client";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const initialState: SignInState = {
  errors: undefined,
  message: undefined,
};

export default function SignInPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(signInAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  // Handle authentication after successful validation
  useEffect(() => {
    if (state.success && state.data) {
      const performSignIn = async () => {
        const timeoutId = setTimeout(() => {
          setAuthError(
            "Connection timeout. Please check your internet connection and try again."
          );
          console.error("[Sign In] Timeout after 30 seconds");
        }, 30000); // 30 second timeout

        try {
          console.log("[Sign In] Starting authentication...");
          console.log("[Sign In] Email:", state.data!.email);
          
          // Test API connectivity first
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          console.log("[Sign In] Testing API connectivity to:", apiUrl);
          
          const result = await signIn.email(
            {
              email: state.data!.email,
              password: state.data!.password,
            },
            {
              onRequest: (ctx) => {
                console.log("[Sign In] onRequest called", ctx);
              },
              onError: (ctx) => {
                clearTimeout(timeoutId);
                console.error("[Sign In] onError called:", ctx);
                const errorMessage = ctx.error.message || "Failed to sign in";
                
                // Provide more helpful error messages
                if (errorMessage.includes("fetch") || errorMessage.includes("network")) {
                  setAuthError(
                    "Unable to connect to authentication server. Please check your connection and try again."
                  );
                } else if (errorMessage.includes("credentials")) {
                  setAuthError("Invalid email or password. Please try again.");
                } else {
                  setAuthError(errorMessage);
                }
              },
              onSuccess: () => {
                clearTimeout(timeoutId);
                console.log("[Sign In] onSuccess called");
              },
            }
          );
          
          console.log("[Sign In] Result:", result);
        } catch (error) {
          clearTimeout(timeoutId);
          console.error("[Sign In] Caught error:", error);
          if (error instanceof Error) {
            console.error("[Sign In] Error details:", {
              name: error.name,
              message: error.message,
              stack: error.stack,
            });
            if (error.name === "AbortError" || error.message.includes("timeout")) {
              setAuthError(
                "Request timeout. The server took too long to respond. Please try again."
              );
            } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
              setAuthError(
                "Network error. Please check if the API server is running and accessible."
              );
            } else {
              setAuthError(error.message || "An unexpected error occurred");
            }
          } else {
            console.error("[Sign In] Non-Error object caught:", error);
            setAuthError("An unexpected error occurred. Please try again.");
          }
        }
      };
      performSignIn();
    }
  }, [state.success, state.data, router]);

  const onSubmit = handleSubmit((data) => {
    setAuthError(null);
    startTransition(() => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formAction(formData);
    });
  });

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
      <div className="w-full max-w-md m-auto">
        <Card>
          <form onSubmit={onSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in to your account</CardTitle>
              <CardDescription>
                Enter your email and password to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {authError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {authError}
                </div>
              )}
              {state.message && !authError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {state.message}
                </div>
              )}
              <div className="relative">
             
           
              </div>
              {(state.message && !state.success) || authError ? (
                <div className="text-sm text-red-500">
                  {authError || state.message}
                </div>
              ) : null}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  disabled={isPending}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                {state.errors?.email && (
                  <p className="text-sm text-red-500">{state.errors.email[0]}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isPending}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
                {state.errors?.password && (
                  <p className="text-sm text-red-500">{state.errors.password[0]}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mt-5">
              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}