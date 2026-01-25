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
        try {
          await signIn.email(
            {
              email: state.data!.email,
              password: state.data!.password,
            },
            {
              onError: (ctx) => {
                setAuthError(ctx.error.message || "Failed to sign in");
              },
            }
          );
        } catch (error) {
          setAuthError("An unexpected error occurred");
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