"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function GithubButton() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  return (
    <Button onClick={() => signIn("github", { callbackUrl })}>Github</Button>
  );
}

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Sign in to RevisionBuddy</h1>
        <Suspense fallback={<Button disabled>Github</Button>}>
          <GithubButton />
        </Suspense>
      </div>
    </div>
  );
}
