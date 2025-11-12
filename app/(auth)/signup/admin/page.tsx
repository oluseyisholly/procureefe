"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";

export default function AdminSignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    router.push("/signin");
  }

  return (
    <AuthShell
      title="Lead a Procuree Buying Group"
      subtitle="Register your cooperative, share your sourcing needs, and invite patrons who believe in your mission."
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800" htmlFor="firstName">
              First name
            </label>
            <Input id="firstName" name="firstName" placeholder="Chiamaka" required autoComplete="given-name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-emerald-800" htmlFor="lastName">
              Last name
            </label>
            <Input id="lastName" name="lastName" placeholder="Ibrahim" required autoComplete="family-name" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="email">
            Email address
          </label>
          <Input id="email" name="email" type="email" placeholder="team@procuree.co" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="phone">
            Phone number
          </label>
          <Input id="phone" name="phone" type="tel" placeholder="0801 234 5678" required autoComplete="tel" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="groupName">
            Group name
          </label>
          <Input id="groupName" name="groupName" placeholder="Lekki Farmers Collective" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-emerald-800" htmlFor="groupDescription">
            Group description
          </label>
          <TextArea
            id="groupDescription"
            name="groupDescription"
            placeholder="Tell patrons what your group sources, your volumes, and your collaboration preferences."
            required
            rows={5}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Preparing your hub..." : "Launch a Procuree group"}
        </Button>
        <div className="space-y-3 text-center text-sm text-emerald-600">
          <p>
            Signing up as a patron instead?{" "}
            <Link href="/signup" className="font-semibold text-emerald-800 hover:underline">
              Register as a user
            </Link>
          </p>
          <p>
            Already coordinating orders?{" "}
            <Link href="/signin" className="font-semibold text-emerald-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
