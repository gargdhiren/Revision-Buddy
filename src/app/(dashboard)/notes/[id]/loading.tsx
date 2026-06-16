import { Skeleton } from "@/components/ui/skeleton";

// Matches the NoteEditor layout: toolbar row, large title, rich-text body.
export default function NoteLoading() {
  return (
    <div className="pb-16">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* Toolbar: back/save on the left, actions on the right */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28 border-0" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-7 w-9" />
          </div>
        </div>

        {/* Title */}
        <Skeleton className="h-10 w-2/3 border-0" />

        {/* Body lines */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-full border-0" />
          <Skeleton className="h-4 w-11/12 border-0" />
          <Skeleton className="h-4 w-full border-0" />
          <Skeleton className="h-4 w-4/5 border-0" />
          <Skeleton className="h-4 w-2/3 border-0" />
          <Skeleton className="h-4 w-full border-0 mt-4" />
          <Skeleton className="h-4 w-3/4 border-0" />
        </div>
      </div>
    </div>
  );
}
