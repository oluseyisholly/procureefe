"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "default" | "lg" | "sm" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-500 focus-visible:ring-emerald-500",
  secondary:
    "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 focus-visible:ring-emerald-300",
  ghost: "bg-transparent text-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  default: "px-4 py-2",
  lg: "px-6 py-3 text-base",
  sm: "px-3 py-1.5 text-xs",
  icon: "p-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
