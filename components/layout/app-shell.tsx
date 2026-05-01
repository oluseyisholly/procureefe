"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AppHeader } from "./app-header";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col">
        <AppHeader activePath={pathname} />
        <main className="flex-1 bg-[#E9F4EE] px-6 py-10">{children}</main>
      </div>
    </div>
  );
}
