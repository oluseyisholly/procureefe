"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UserSignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    router.push("/signin");
  }

  return (
    <AuthShell
      title="Join Procuree as a Patron"
      subtitle="Share your interests with bulk buying groups and receive curated offers tailored to your community."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800" htmlFor="firstName">
              First name
            </label>
            <Input id="firstName" name="firstName" placeholder="Ada" required autoComplete="given-name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800" htmlFor="lastName">
              Last name
            </label>
            <Input id="lastName" name="lastName" placeholder="Okeke" required autoComplete="family-name" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="email">
            Email address
          </label>
          <Input id="email" name="email" type="email" placeholder="you@patron.com" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="phone">
            Phone number
          </label>
          <Input id="phone" name="phone" type="tel" placeholder="0801 234 5678" required autoComplete="tel" />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating your profile..." : "Become a Procuree Patron"}
        </Button>
        <div className="space-y-3 text-center text-sm text-emerald-600">
          <p>
            Need to onboard a buying group?{" "}
            <Link href="/signup/admin" className="font-semibold text-emerald-800 hover:underline">
              Create an admin account
            </Link>
          </p>
          <p>
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-emerald-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
