import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ActivitiesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Activities</h1>
        <p className="text-muted-foreground mt-2">
          Manage activities - the atomic building blocks for tour packages.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard/activities/new">
          <Plus className="mr-2 h-4 w-4" />
          Add Activity
        </Link>
      </Button>
    </div>
  );
}
