import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NoteEditor } from "@/components/notes/note-editor";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const note = await db.note.findUnique({
    where: { id, userId: session!.user.id },
    include: { _count: { select: { flashcards: true } } },
  });

  if (!note) notFound();

  const { _count, ...noteData } = note;

  return (
    <div className="pb-16">
      <NoteEditor note={noteData} />
      {_count.flashcards > 0 && (
        <div className="max-w-3xl mx-auto mt-6 flex items-center justify-between border rounded-lg px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {_count.flashcards} flashcard{_count.flashcards !== 1 ? "s" : ""} generated
          </p>
          <Link
            href="/review"
            className="text-sm font-medium text-primary hover:underline"
          >
            Start Review →
          </Link>
        </div>
      )}
    </div>
  );
}
