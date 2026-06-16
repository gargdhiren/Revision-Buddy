import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const daysPerBox: Record<number, number> = { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 };

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { flashcardId, result } = await req.json();

  const flashcard = await db.flashcard.findUnique({
    where: { id: flashcardId },
    include: { note: { select: { userId: true } } },
  });

  if (!flashcard || flashcard.note.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isCorrect = result === "CORRECT";
  const newBox = isCorrect ? Math.min(flashcard.box + 1, 5) : 1;
  const daysUntilNext = daysPerBox[newBox] ?? 1;
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + daysUntilNext);

  await Promise.all([
    db.reviewHistory.create({
      data: { flashcardId, result },
    }),
    db.flashcard.update({
      where: { id: flashcardId },
      data: { box: newBox, nextReviewAt },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
