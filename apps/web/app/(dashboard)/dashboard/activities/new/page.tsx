import { AddActivityForm } from "@/components/dashboard/add-activity-form";

export default function NewActivityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Activity</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details below to create a new activity
        </p>
      </div>
      <AddActivityForm />
    </div>
  );
}