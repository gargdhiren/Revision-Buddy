import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
      <span className="font-semibold text-lg">RevisionBuddy</span>
      <div className="flex items-center gap-3">
        {session?.user && (
          <>
            <span className="text-sm text-muted-foreground">
              {session.user.email ?? session.user.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/signin" });
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
