"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createActivityAction, type CreateActivityState } from "@/actions/activities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be less than 255 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional().nullable(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
  location: z.string().min(1, "Location is required").max(255, "Location must be less than 255 characters"),
  durationMinutes: z.number().int("Duration must be an integer").positive("Duration must be positive"),
  price: z.number().nonnegative("Price must be non-negative"),
});

type FormData = z.infer<typeof formSchema>;

const initialState: CreateActivityState = {
  message: undefined,
  errors: undefined,
};

export function AddActivityForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createActivityAction,
    initialState
  );

  const {
    register,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Redirect on success
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push("/dashboard/activities");
      }, 1500);
    }
  }, [state.success, router]);

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Add New Activity</CardTitle>
        <CardDescription>
          Create a new activity that can be included in tour packages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {/* Success Message */}
          {state.success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {state.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {state.message && !state.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Activity Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Guided Safari Tour"
              disabled={isPending}
            />
            {(errors.name || state.errors?.name) && (
              <p className="text-sm text-red-500">
                {errors.name?.message || state.errors?.name?.[0]}
              </p>
            )}
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., Kruger National Park, South Africa"
              disabled={isPending}
            />
            {(errors.location || state.errors?.location) && (
              <p className="text-sm text-red-500">
                {errors.location?.message || state.errors?.location?.[0]}
              </p>
            )}
          </div>

          {/* Duration Field */}
          <div className="space-y-2">
            <Label htmlFor="durationMinutes">
              Duration (minutes) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="durationMinutes"
              type="number"
              {...register("durationMinutes", { valueAsNumber: true })}
              placeholder="e.g., 180"
              min="1"
              step="1"
              disabled={isPending}
            />
            {(errors.durationMinutes || state.errors?.durationMinutes) && (
              <p className="text-sm text-red-500">
                {errors.durationMinutes?.message || state.errors?.durationMinutes?.[0]}
              </p>
            )}
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="e.g., 150.00"
              min="0"
              step="0.01"
              disabled={isPending}
            />
            {(errors.price || state.errors?.price) && (
              <p className="text-sm text-red-500">
                {errors.price?.message || state.errors?.price?.[0]}
              </p>
            )}
          </div>

          {/* Image URL Field */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg"
              disabled={isPending}
            />
            {(errors.imageUrl || state.errors?.imageUrl) && (
              <p className="text-sm text-red-500">
                {errors.imageUrl?.message || state.errors?.imageUrl?.[0]}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the activity, what participants will experience, etc."
              rows={5}
              disabled={isPending}
            />
            {(errors.description || state.errors?.description) && (
              <p className="text-sm text-red-500">
                {errors.description?.message || state.errors?.description?.[0]}
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Activity"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
