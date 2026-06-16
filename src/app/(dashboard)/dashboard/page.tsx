import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { WeeklyChart } from "@/components/dashboard/weekly-chart";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Flame, Clock, Layers, ArrowRight } from "lucide-react";

async function getStats(userId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [notesCount, flashcardsCount, dueCount, recentNotes, weeklyReviews, allReviewDates] =
    await Promise.all([
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

  return { notesCount, flashcardsCount, dueCount, recentNotes, streak, chartData };
}

export default async function DashboardPage() {
  const session = await auth();
  const { notesCount, flashcardsCount, dueCount, recentNotes, streak, chartData } =
    await getStats(session!.user.id);

  const name = session!.user.name?.split(" ")[0] ?? "there";

  const stats = [
    { label: "Due Today", value: dueCount, icon: Clock, highlight: dueCount > 0 },
    { label: "Notes", value: notesCount, icon: FileText, highlight: false },
    { label: "Flashcards", value: flashcardsCount, icon: Layers, highlight: false },
    { label: "Day Streak", value: streak, icon: Flame, highlight: streak > 0 },
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">Good day, {name}!</h1>
        <p className="text-muted-foreground text-sm mt-1">Here&apos;s where you stand today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border rounded-xl p-4 bg-card shadow-sm flex flex-col gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.highlight ? "bg-primary/10" : "bg-muted"}`}>
              <stat.icon className={`w-4 h-4 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className={`text-3xl font-bold ${stat.highlight ? "text-primary" : ""}`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {dueCount > 0 && (
        <Link href="/review">
          <Button className="w-full gap-2">
            <Brain className="w-4 h-4" />
            Start Review — {dueCount} card{dueCount !== 1 ? "s" : ""} due
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>
        </Link>
      )}

      <WeeklyChart data={chartData} />

      {recentNotes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recent Notes</h2>
            <Link href="/notes" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {recentNotes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
              >
                <span className="text-sm">{note.title || "Untitled"}</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {recentNotes.length === 0 && (
        <div className="border rounded-xl p-10 text-center bg-card">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium mb-1">No notes yet</p>
          <p className="text-sm text-muted-foreground mb-4">Create your first note to get started.</p>
          <Link href="/notes">
            <Button size="sm">Create a note</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
