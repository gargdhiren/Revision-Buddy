// Shown instantly (via the App Router's automatic Suspense boundary) while any
// dashboard route's server component fetches data. Prevents the "frozen page"
// feeling that makes users click navigation links repeatedly.
function Block({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md border-2 border-foreground/15 bg-muted ${className}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Block className="h-8 w-56" />
          <Block className="h-4 w-40 border-0" />
        </div>
        <Block className="h-8 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Block key={i} className="h-28" />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Block key={i} className="h-32" />
        ))}
      </div>

      <Block className="h-48" />
    </div>
  );
}
