import { Skeleton } from "@/components/ui/skeleton";

// Matches the centered auth card (sign in / sign up).
export default function AuthLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="flex w-full flex-col items-center gap-2">
          <Skeleton className="h-7 w-56 border-0" />
          <Skeleton className="h-4 w-64 border-0" />
        </div>
        <div className="brutal-card rounded-md p-6 bg-card w-full flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-40 mx-auto border-0" />
        </div>
      </div>
    </div>
  );
}
