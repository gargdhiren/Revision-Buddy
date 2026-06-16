import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { PageTitle } from "@/components/page-title";
import { auth, signOut } from "@/lib/auth";
import { LogOut } from "lucide-react";

export async function Header({ dueCount }: { dueCount: number }) {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b-2 border-foreground bg-background/90 px-4 backdrop-blur-sm sm:px-5">
      <div className="flex items-center gap-2">
        <MobileNav dueCount={dueCount} />
        <PageTitle />
      </div>

      <div className="flex items-center gap-2">
        {session?.user && (
          <>
            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground bg-primary text-xs font-bold text-primary-foreground">
              {(session.user.name ?? session.user.email ?? "?")[0].toUpperCase()}
            </div>
            <span className="hidden text-sm text-muted-foreground sm:block">
              {session.user.name ?? session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/signin" });
              }}
            >
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
