import { notFound } from "next/navigation";
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
  });

  if (!note) notFound();

  return <NoteEditor note={note} />;
}
