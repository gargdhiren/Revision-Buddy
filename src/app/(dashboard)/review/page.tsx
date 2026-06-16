import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReviewSession } from "@/components/review/review-session";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen } from "lucide-react";

export default async function ReviewPage() {
  const session = await auth();

  const flashcards = await db.flashcard.findMany({
    where: {
      note: { userId: session!.user.id },
      nextReviewAt: { lte: new Date() },
    },
    orderBy: { nextReviewAt: "asc" },
  });

  if (flashcards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold">All caught up!</h1>
        <p className="text-muted-foreground max-w-sm">
          No cards are due for review right now. Generate flashcards from your notes or check back later.
        </p>
        <Link href="/notes">
          <Button variant="outline" className="gap-2 mt-2">
            <BookOpen className="w-4 h-4" />
            Go to Notes
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Review Session</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {flashcards.length} card{flashcards.length !== 1 ? "s" : ""} due today
        </p>
      </div>
      <ReviewSession flashcards={flashcards} />
    </div>
  );
}
