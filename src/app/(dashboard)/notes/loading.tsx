import { Skeleton } from "@/components/ui/skeleton";

// Matches NotesPage: header (title + search + new note) and a grid of NoteCards.
export default function NotesLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40 border-0" />
          <Skeleton className="h-4 w-20 border-0" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="brutal-card rounded-md p-5 bg-card flex flex-col gap-3"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-3/4 border-0" />
                <Skeleton className="h-3 w-full border-0" />
              </div>
            </div>
            <Skeleton className="h-3 w-24 border-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
