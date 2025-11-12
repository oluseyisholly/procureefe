"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-emerald-100 bg-white px-4 py-2 text-sm text-emerald-950 placeholder:text-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
