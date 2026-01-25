export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <p className="text-muted-foreground">
        Manage user accounts and permissions.
      </p>
    </div>
  );
}
