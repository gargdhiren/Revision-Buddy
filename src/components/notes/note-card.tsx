import Link from "next/link";
import type { Note } from "@prisma/client";

export function NoteCard({ note }: { note: Note }) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="block p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
    >
      <h3 className="font-medium truncate">{note.title || "Untitled"}</h3>
      <p className="text-sm text-muted-foreground mt-1 truncate">
        {note.content || "No content yet"}
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </Link>
  );
}
