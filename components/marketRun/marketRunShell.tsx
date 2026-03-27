"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Stepper } from "../ui/stepper";

export function MarketRunShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentStep = pathname.startsWith("/market-run/review")
    ? 3
    : pathname.startsWith("/market-run/item")
      ? 2
      : 1;

  return (
    <div className="flex ">
      <div className="flex gap-[27px] flex-1 flex-col items-center">
        <Stepper
          steps={[
            { label: "Details", href: "/market-run/details" },
            { label: "Items", href: "/market-run/item" },
            { label: "Review", href: "/market-run/review" },
          ]}
          currentStep={currentStep}
          className="!max-w-[388px]"
        />
        <main className="flex-1 bg-[#FFFFFF] w-full max-w-[1005px] rounded-[8px] px-6 py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
