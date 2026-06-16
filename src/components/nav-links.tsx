"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/notes", label: "Notes", icon: BookOpen },
  { href: "/review", label: "Review", icon: Brain },
];

export function NavLinks({
  dueCount = 0,
  onNavigate,
}: {
  dueCount?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const isActive =
          link.href === "/notes"
            ? pathname === "/notes" || pathname.startsWith("/notes/")
            : pathname === link.href;
        const showBadge = link.href === "/review" && dueCount > 0;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-md border-2 px-3 py-2 text-sm font-semibold transition-all",
              isActive
                ? "border-foreground bg-primary text-primary-foreground shadow-sm"
                : "border-transparent text-muted-foreground hover:border-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <link.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{link.label}</span>
            {showBadge && (
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-foreground px-1.5 text-[11px] font-bold tabular-nums",
                  isActive
                    ? "bg-card text-foreground"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {dueCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
