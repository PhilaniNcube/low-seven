"use client";

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
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpAction, type SignUpState } from "@/actions/auth";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const initialState: SignUpState = {
  errors: undefined,
  message: undefined,
};

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUpAction, initialState);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("name", data.name);
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
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Enter your details below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              
              <div className="relative">
               
              </div>
              {state.message && !state.success && (
                <div className="text-sm text-red-500">
                  {state.message}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  disabled={isPending}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
                {state.errors?.name && (
                  <p className="text-sm text-red-500">{state.errors.name[0]}</p>
                )}
              </div>
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
                {isPending ? "Creating account..." : "Create account"}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/signin" className="underline underline-offset-4 hover:text-primary">
                  Sign in
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