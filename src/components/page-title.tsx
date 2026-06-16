"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/notes": "Notes",
  "/review": "Review",
};

export function PageTitle() {
  const pathname = usePathname();

  let title = TITLES[pathname];
  if (!title && pathname.startsWith("/notes/")) title = "Note";

  return (
    <h1 className="text-sm font-semibold tracking-tight">{title ?? ""}</h1>
  );
}
