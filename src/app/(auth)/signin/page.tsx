"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BookOpen, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

function GitBranchButton() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      onClick={() => signIn("github", { callbackUrl })}
    >
      <GitBranch className="w-4 h-4" />
      Continue with GitHub
    </Button>
  );
}

export default function SignIn() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-md border-2 border-foreground bg-primary flex items-center justify-center mb-4 shadow-sm">
            <BookOpen className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Welcome to Revision Buddy</h1>
          <p className="text-muted-foreground text-sm mt-2 text-center">
            Sign in to start turning your notes into long-term knowledge.
          </p>
        </div>

        <div className="brutal-card rounded-md p-6 bg-card flex flex-col gap-4">
          <Suspense
            fallback={
              <Button size="lg" className="w-full gap-2" disabled>
                <GitBranch className="w-4 h-4" />
                Continue with GitHub
              </Button>
            }
          >
            <GitBranchButton />
          </Suspense>
          <p className="text-xs text-muted-foreground text-center">
            No credit card required. Free forever.
          </p>
        </div>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors underline underline-offset-4">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
