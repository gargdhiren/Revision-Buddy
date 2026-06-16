"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Code, Quote,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (json: string) => void;
}

interface ToolbarButton {
  icon: React.ElementType;
  tooltip: string;
  isActive: boolean;
  onClick: () => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    content: content ? JSON.parse(content) : "",
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()));
    },
  });

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold") ?? false,
      isItalic: ctx.editor?.isActive("italic") ?? false,
      isH1: ctx.editor?.isActive("heading", { level: 1 }) ?? false,
      isH2: ctx.editor?.isActive("heading", { level: 2 }) ?? false,
      isH3: ctx.editor?.isActive("heading", { level: 3 }) ?? false,
      isBulletList: ctx.editor?.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
      isCodeBlock: ctx.editor?.isActive("codeBlock") ?? false,
      isBlockquote: ctx.editor?.isActive("blockquote") ?? false,
    }),
  });

  if (!editor || !editorState) return null;

  const buttons: ToolbarButton[] = [
    { icon: Bold, tooltip: "Bold (Ctrl+B)", isActive: editorState.isBold, onClick: () => editor.chain().focus().toggleBold().run() },
    { icon: Italic, tooltip: "Italic (Ctrl+I)", isActive: editorState.isItalic, onClick: () => editor.chain().focus().toggleItalic().run() },
    { icon: Heading1, tooltip: "Heading 1", isActive: editorState.isH1, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: Heading2, tooltip: "Heading 2", isActive: editorState.isH2, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: Heading3, tooltip: "Heading 3", isActive: editorState.isH3, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { icon: List, tooltip: "Bullet List", isActive: editorState.isBulletList, onClick: () => editor.chain().focus().toggleBulletList().run() },
    { icon: ListOrdered, tooltip: "Numbered List", isActive: editorState.isOrderedList, onClick: () => editor.chain().focus().toggleOrderedList().run() },
    { icon: Code, tooltip: "Code Block", isActive: editorState.isCodeBlock, onClick: () => editor.chain().focus().toggleCodeBlock().run() },
    { icon: Quote, tooltip: "Blockquote", isActive: editorState.isBlockquote, onClick: () => editor.chain().focus().toggleBlockquote().run() },
  ];

  return (
    <div className="w-full flex flex-col gap-2">
      <TooltipProvider delay={400}>
        <div className="flex items-center gap-0.5 flex-wrap border rounded-lg p-1 bg-muted/30">
          {buttons.map((btn, i) => (
            <Tooltip key={i}>
              <TooltipTrigger
                render={<span />}
                onClick={btn.onClick}
                className={cn(
                  "inline-flex items-center justify-center rounded-md w-8 h-8 transition-colors cursor-pointer",
                  btn.isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <btn.icon className="w-4 h-4" />
              </TooltipTrigger>
              <TooltipContent>{btn.tooltip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <EditorContent editor={editor} className="min-h-[500px]" />
    </div>
  );
}
