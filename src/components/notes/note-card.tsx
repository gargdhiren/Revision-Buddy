import Link from "next/link";
import type { Note } from "@prisma/client";
import { FileText } from "lucide-react";
import { extractPlainText } from "@/lib/tiptap";

export function NoteCard({ note }: { note: Note }) {
  const preview = extractPlainText(note.content);
  return (
    <Link
      href={`/notes/${note.id}`}
      className="group flex flex-col gap-3 p-5 rounded-xl border bg-card shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-medium truncate group-hover:text-primary transition-colors">
            {note.title || "Untitled"}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {preview || "No content yet"}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {new Date(note.updatedAt).toLocaleDateString("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
    </Link>
  );
}
