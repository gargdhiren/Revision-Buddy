import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const dueCount = await db.flashcard.count({
    where: {
      note: { userId: session.user.id },
      nextReviewAt: { lte: new Date() },
    },
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar dueCount={dueCount} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header dueCount={dueCount} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
