"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { Note } from "@prisma/client";
import { deleteNote } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";

export function NoteEditor({ note }: { note: Note }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);

  const save = useDebouncedCallback(async (title: string, content: string) => {
    setIsSaving(true);
    await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setIsSaving(false);
  }, 1000);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {isSaving ? "Saving..." : "Saved"}
        </span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteNote(note.id)}
        >
          Delete
        </Button>
      </div>

      <input
        className="text-3xl font-bold bg-transparent border-none outline-none w-full placeholder:text-muted-foreground"
        placeholder="Untitled"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          save(e.target.value, content);
        }}
      />

      <textarea
        className="w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed placeholder:text-muted-foreground"
        style={{ minHeight: "500px" }}
        placeholder="Start writing..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          save(title, e.target.value);
        }}
      />
    </div>
  );
}
