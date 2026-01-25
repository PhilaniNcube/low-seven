export default async function BookingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookings</h1>
      </div>
      <p className="text-muted-foreground">
        View and manage customer bookings and reservations.
      </p>
    </div>
  );
}
