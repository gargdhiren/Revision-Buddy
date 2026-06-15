"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/notes", label: "Notes" },
  { href: "/review", label: "Review" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 bg-sidebar border-r flex flex-col p-3 gap-1 shrink-0">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Menu</p>
      {links.map((link) => {
        const isActive = link.href === pathname;

        return (
          <Link
            className={cn(
              "block px-3 py-2 rounded-md text-sm",
              isActive
                ? "font-semibold border-l-2 border-blue-500 pl-2.5"
                : "text-muted-foreground",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
