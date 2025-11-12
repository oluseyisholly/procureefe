"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-emerald-100 bg-white px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200",
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";
