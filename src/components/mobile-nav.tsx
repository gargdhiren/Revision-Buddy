"use client";

import { useState } from "react";
import { Menu, BookOpen } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLinks } from "@/components/nav-links";

export function MobileNav({ dueCount }: { dueCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="md:hidden" />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open navigation</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
        <div className="flex h-14 items-center gap-2.5 border-b-2 border-foreground px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-foreground bg-primary">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <SheetTitle>Revision Buddy</SheetTitle>
        </div>
        <div className="p-3">
          <NavLinks dueCount={dueCount} onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
