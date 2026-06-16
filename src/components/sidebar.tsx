import { BookOpen } from "lucide-react";
import { NavLinks } from "@/components/nav-links";

export function Sidebar({ dueCount }: { dueCount: number }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <BookOpen className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold tracking-tight">RevisionBuddy</span>
      </div>

      <div className="flex-1 p-3">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        <NavLinks dueCount={dueCount} />
      </div>
    </aside>
  );
}
