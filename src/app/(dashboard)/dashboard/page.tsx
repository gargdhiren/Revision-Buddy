import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { Button } from "@/components/ui/button";
import {
  Brain,
  FileText,
  Flame,
  Clock,
  Layers,
  ArrowRight,
  Zap,
  Eraser,
  ListChecks,
  Trophy,
} from "lucide-react";

async function getStats(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [
    notesCount,
    flashcardsCount,
    dueCount,
    recentNotes,
    weeklyReviews,
    allReviewDates,
    byType,
    byBox,
  ] = await Promise.all([
    db.note.count({ where: { userId } }),
    db.flashcard.count({ where: { note: { userId } } }),
    db.flashcard.count({
      where: { note: { userId }, nextReviewAt: { lte: new Date() } },
    }),
    db.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, updatedAt: true },
    }),
    db.reviewHistory.findMany({
      where: {
        flashcard: { note: { userId } },
        reviewedAt: { gte: sevenDaysAgo },
      },
      select: { reviewedAt: true, result: true },
    }),
    db.reviewHistory.findMany({
      where: { flashcard: { note: { userId } } },
      select: { reviewedAt: true },
      orderBy: { reviewedAt: "desc" },
    }),
    db.flashcard.groupBy({
      by: ["type"],
      where: { note: { userId } },
      _count: { _all: true },
    }),
    db.flashcard.groupBy({
      by: ["box"],
      where: { note: { userId } },
      _count: { _all: true },
    }),
  ]);

  const uniqueDates = [
    ...new Set(allReviewDates.map((r) => r.reviewedAt.toISOString().split("T")[0])),
  ];
  let streak = 0;
  for (let i = 0; i < uniqueDates.length; i++) {
    const expected = new Date();
    expected.setDate(expected.getDate() - i);
    if (uniqueDates[i] === expected.toISOString().split("T")[0]) streak++;
    else break;
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const reviewsByDate = weeklyReviews.reduce(
    (acc, r) => {
      const date = r.reviewedAt.toISOString().split("T")[0];
      if (!acc[date]) acc[date] = { correct: 0, incorrect: 0 };
      if (r.result === "CORRECT") acc[date].correct++;
      else acc[date].incorrect++;
      return acc;
    },
    {} as Record<string, { correct: number; incorrect: number }>
  );

  const chartData = days.map((day) => ({
    day: new Date(day + "T12:00:00").toLocaleDateString("en", { weekday: "short" }),
    correct: reviewsByDate[day]?.correct ?? 0,
    incorrect: reviewsByDate[day]?.incorrect ?? 0,
  }));

  const typeCounts = byType.reduce(
    (acc, t) => {
      acc[t.type] = t._count._all;
      return acc;
    },
    {} as Record<string, number>
  );

  const boxCounts = byBox.reduce(
    (acc, b) => {
      acc[b.box] = b._count._all;
      return acc;
    },
    {} as Record<number, number>
  );

  return {
    notesCount,
    flashcardsCount,
    dueCount,
    recentNotes,
    streak,
    chartData,
    typeCounts,
    boxCounts,
  };
}

// The three generation techniques (FlashcardType enum)
const TECHNIQUES = [
  {
    type: "FLASHCARD",
    label: "Active Recall",
    desc: "Classic question → answer prompts",
    icon: Zap,
  },
  {
    type: "CLOZE",
    label: "Cloze Deletion",
    desc: "Fill the blank from context",
    icon: Eraser,
  },
  {
    type: "MCQ",
    label: "Multiple Choice",
    desc: "Pick the right one of four",
    icon: ListChecks,
  },
] as const;

// Leitner schedule: box → days until next review (api/review/route.ts)
const BOXES = [
  { box: 1, days: "1d", label: "New" },
  { box: 2, days: "2d", label: "Learning" },
  { box: 3, days: "4d", label: "Young" },
  { box: 4, days: "8d", label: "Mature" },
  { box: 5, days: "16d", label: "Mastered" },
];

export default async function DashboardPage() {
  const session = await auth();
  const {
    notesCount,
    flashcardsCount,
    dueCount,
    recentNotes,
    streak,
    chartData,
    typeCounts,
    boxCounts,
  } = await getStats(session!.user.id);

  const name = session!.user.name?.split(" ")[0] ?? "there";
  const mastered = boxCounts[5] ?? 0;
  const maxBox = Math.max(1, ...BOXES.map((b) => boxCounts[b.box] ?? 0));

  const stats = [
    { label: "Due Today", value: dueCount, icon: Clock, highlight: dueCount > 0 },
    { label: "Notes", value: notesCount, icon: FileText, highlight: false },
    { label: "Flashcards", value: flashcardsCount, icon: Layers, highlight: false },
    { label: "Day Streak", value: streak, icon: Flame, highlight: streak > 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Hero */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Good day, {name}!</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here&apos;s where you stand today.
          </p>
        </div>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-primary px-3 py-1 text-sm font-bold text-primary-foreground shadow-sm">
            <Flame className="h-4 w-4" />
            {streak} day{streak !== 1 ? "s" : ""} streak
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`brutal-card rounded-md p-4 flex flex-col gap-3 ${
              stat.highlight ? "bg-primary" : "bg-card"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-md border-2 border-foreground flex items-center justify-center ${
                stat.highlight ? "bg-card" : "bg-secondary"
              }`}
            >
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <p
                className={`text-3xl font-bold ${
                  stat.highlight ? "text-primary-foreground" : ""
                }`}
              >
                {stat.value}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  stat.highlight
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Due CTA */}
      {dueCount > 0 && (
        <Link href="/review">
          <Button size="lg" className="w-full gap-2">
            <Brain className="w-4 h-4" />
            Start Review — {dueCount} card{dueCount !== 1 ? "s" : ""} due
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>
        </Link>
      )}

      {/* Learning Techniques */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Learning Techniques
          </h2>
          <span className="text-xs text-muted-foreground">
            {flashcardsCount} flashcard{flashcardsCount !== 1 ? "s" : ""} total
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TECHNIQUES.map((t) => {
            const count = typeCounts[t.type] ?? 0;
            const pct = flashcardsCount ? Math.round((count / flashcardsCount) * 100) : 0;
            return (
              <div key={t.type} className="brutal-card rounded-md bg-card p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-md border-2 border-foreground bg-secondary flex items-center justify-center">
                    <t.icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-bold tabular-nums">{count}</span>
                </div>
                <div>
                  <p className="font-bold text-sm">{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                </div>
                <div className="h-2 w-full rounded-full border-2 border-foreground bg-card overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mastery — Leitner boxes */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider">Mastery</h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" />
            {mastered} mastered
          </span>
        </div>
        <div className="brutal-card rounded-md bg-card p-5">
          <div className="grid grid-cols-5 gap-3">
            {BOXES.map((b) => {
              const count = boxCounts[b.box] ?? 0;
              const h = Math.round((count / maxBox) * 56) + 4;
              return (
                <div key={b.box} className="flex flex-col items-center gap-2">
                  <span className="text-sm font-bold tabular-nums">{count}</span>
                  <div className="flex h-16 w-full items-end">
                    <div
                      className="w-full rounded-sm border-2 border-foreground bg-primary"
                      style={{ height: `${h}px` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold">{b.label}</p>
                    <p className="text-[10px] text-muted-foreground">every {b.days}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            Cards climb the boxes with each correct review (intervals 1 → 2 → 4 → 8 →
            16 days). Miss one and it drops back to <span className="font-semibold text-foreground">New</span> — the Leitner spaced-repetition system.
          </p>
        </div>
      </section>

      {/* Weekly activity */}
      <WeeklyChart data={chartData} />

      {/* Recent notes */}
      {recentNotes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider">Recent Notes</h2>
            <Link
              href="/notes"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="brutal-card rounded-md bg-card divide-y-2 divide-foreground overflow-hidden">
            {recentNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors group"
              >
                <span className="text-sm font-medium">{note.title || "Untitled"}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recentNotes.length === 0 && (
        <div className="brutal-card rounded-md p-10 text-center bg-card">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-bold mb-1">No notes yet</p>
          <p className="text-sm text-muted-foreground mb-4">
            Create a note, then generate 6–8 flashcards from it with one click.
          </p>
          <Link href="/notes">
            <Button size="sm">Create a note</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
