import * as React from "react";

import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

const checkboxBaseClass =
  "h-[20px] w-[20px] shrink-0 appearance-none rounded-full border border-[#D1D1D6] bg-white align-middle outline-none transition-colors checked:border-[#0F6A44] checked:bg-[#0F6A44] focus-visible:ring-2 focus-visible:ring-[#0F6A44]/30 disabled:cursor-not-allowed disabled:opacity-60";

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(checkboxBaseClass, className)}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";

