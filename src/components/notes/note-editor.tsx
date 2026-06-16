"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import type { Note } from "@prisma/client";
import { deleteNote } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/notes/rich-text-editor";
import { extractPlainText } from "@/lib/tiptap";
import { Sparkles, Trash2, CheckCircle, Loader2, ChevronLeft } from "lucide-react";

export function NoteEditor({ note }: { note: Note }) {
  const router = useRouter();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const save = useDebouncedCallback(async (title: string, content: string) => {
    setIsSaving(true);
    await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setIsSaving(false);
  }, 1000);

  async function handleGenerate() {
    const plainText = extractPlainText(content);
    if (!plainText.trim()) return;
    setIsGenerating(true);
    await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noteId: note.id, content: plainText }),
    });
    setIsGenerating(false);
    router.refresh();
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Toolbar row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/notes"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Notes
          </Link>
          <span className="text-border">/</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isSaving ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
            ) : (
              <><CheckCircle className="w-3 h-3 text-green-500" /> Saved</>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerate}
            disabled={isGenerating || isSaving}
            className="gap-1.5"
          >
            {isGenerating ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" /> Generate Flashcards</>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={isSaving}
            onClick={() => deleteNote(note.id)}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Title */}
      <input
        className="text-4xl font-bold bg-transparent border-none outline-none w-full placeholder:text-muted-foreground/40"
        placeholder="Untitled"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          save(e.target.value, content);
        }}
      />

      {/* Editor */}
      <RichTextEditor
        key={note.id}
        content={note.content}
        onChange={(json) => {
          setContent(json);
          save(title, json);
        }}
      />
    </div>
  );
}
