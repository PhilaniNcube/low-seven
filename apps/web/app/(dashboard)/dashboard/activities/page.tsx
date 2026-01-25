export default async function ActivitiesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activities</h1>
      </div>
      <p className="text-muted-foreground">
        Manage activities - the atomic building blocks for tour packages.
      </p>
    </div>
  );
}
