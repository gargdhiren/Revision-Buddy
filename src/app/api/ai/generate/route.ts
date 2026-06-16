import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

const cardSchema = z.object({
  type: z.enum(["FLASHCARD", "CLOZE", "MCQ"]),
  front: z.string(),
  back: z.string(),
  options: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId, content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "Note has no content to generate from" }, { status: 400 });
  }

  const note = await db.note.findUnique({
    where: { id: noteId, userId: session.user.id },
  });

  if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: `You are a study assistant. Generate flashcards from the note content below.

Return ONLY a valid JSON array with no explanation, no markdown, no code blocks. Just the raw JSON array.

Each item must have:
- "type": one of "FLASHCARD", "CLOZE", or "MCQ"
- "front": string (question, or sentence with ___ for cloze)
- "back": string (answer, or missing term for cloze, or correct answer for MCQ)
- "options": array of 4 strings only for MCQ (include correct answer as first item)

Generate 6-8 cards total. Mix the types. Be concise.

Note content:
${content}

JSON array:`,
  });

  let cards;
  try {
    const cleaned = text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    cards = z.array(cardSchema).parse(JSON.parse(cleaned));
  } catch {
    return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
  }

  await db.flashcard.deleteMany({ where: { noteId } });

  const flashcards = await Promise.all(
    cards.map((card) =>
      db.flashcard.create({
        data: {
          type: card.type,
          front: card.front,
          back: card.back,
          options: card.options ?? undefined,
          noteId,
        },
      })
    )
  );

  return NextResponse.json(flashcards);
}
