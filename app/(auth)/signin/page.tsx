"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    router.push("/dashboard");
  }

  return (
    <AuthShell
      title="Welcome back to Procuree"
      subtitle="Sign in to coordinate bulk buys, track patron interest, and keep your procurement cycle humming."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="email">
            Email address
          </label>
          <Input id="email" name="email" type="email" placeholder="you@procuree.com" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="password">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing you in..." : "Access Procuree"}
        </Button>
        <p className="text-center text-sm text-emerald-600">
          Need an account?{" "}
          <Link href="/signup" className="font-semibold text-emerald-800 hover:underline">
            Create a Procuree profile
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
