import { Skeleton } from "@/components/ui/skeleton";

// Matches the Review page: heading + the ReviewSession progress bar and card.
export default function ReviewLoading() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-2">
        <Skeleton className="h-7 w-44 border-0" />
        <Skeleton className="h-4 w-28 border-0" />
      </div>

      <div className="flex flex-col gap-6">
        {/* Progress row */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24 border-0" />
          <Skeleton className="h-4 w-16 border-0" />
        </div>

        {/* Progress bar */}
        <Skeleton className="h-3 w-full rounded-full" />

        {/* Flashcard panel */}
        <div className="brutal-card rounded-md p-8 bg-card flex flex-col gap-6 min-h-[300px]">
          <Skeleton className="h-6 w-28 rounded-full" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-6 w-full border-0" />
            <Skeleton className="h-6 w-3/4 border-0" />
          </div>
          <Skeleton className="h-8 w-36 mt-auto" />
        </div>
      </div>
    </div>
  );
}
