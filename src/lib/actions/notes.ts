"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createNote() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const note = await db.note.create({
    data: {
      title: "Untitled",
      content: "",
      userId: session.user.id,
    },
  });

  redirect(`/notes/${note.id}`);
}

export async function deleteNote(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.note.delete({
    where: { id, userId: session.user.id },
  });

  redirect("/notes");
}
