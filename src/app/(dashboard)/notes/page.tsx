import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NoteCard } from "@/components/notes/note-card";
import { createNote } from "@/lib/actions/notes";
import { SubmitButton } from "@/components/submit-button";
import { SearchInput } from "@/components/notes/search-input";
import { Plus, FileText } from "lucide-react";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const { q } = await searchParams;

  const notes = await db.note.findMany({
    where: {
      userId: session!.user.id,
      ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Notes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {notes.length} note{notes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Suspense>
            <SearchInput />
          </Suspense>
          <form action={createNote}>
            <SubmitButton pendingText="Creating...">
              <Plus className="w-4 h-4" />
              New Note
            </SubmitButton>
          </form>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-7 h-7 text-muted-foreground" />
          </div>
          {q ? (
            <>
              <p className="font-medium">No notes found for &quot;{q}&quot;</p>
              <p className="text-sm text-muted-foreground">Try a different search term.</p>
            </>
          ) : (
            <>
              <p className="font-medium">No notes yet</p>
              <p className="text-sm text-muted-foreground">Create your first note to get started.</p>
              <form action={createNote}>
                <SubmitButton className="mt-2" pendingText="Creating...">
                  <Plus className="w-4 h-4" />
                  Create Note
                </SubmitButton>
              </form>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
