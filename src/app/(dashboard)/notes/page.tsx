import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NoteCard } from "@/components/notes/note-card";
import { createNote } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";

export default async function NotesPage() {
  const session = await auth();
  const notes = await db.note.findMany({
    where: { userId: session!.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Notes</h1>
        <form action={createNote}>
          <Button type="submit">New Note</Button>
        </form>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No notes yet.</p>
          <p className="text-sm mt-1">Create your first note to get started.</p>
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
