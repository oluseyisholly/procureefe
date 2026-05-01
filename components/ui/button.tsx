"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "success";
type ButtonColor = "emerald" | "blue" | "slate" | "red" | "amber";
type ButtonSize = "xs" | "sm" | "default" | "lg" | "xl" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
};

const baseStyles =
  "inline-flex items-center cursor-pointer py-2  justify-center gap-2 whitespace-nowrap rounded-[8px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const colorTokens: Record<
  ButtonColor,
  {
    primary: string;
    secondary: string;
    ghost: string;
    outline: string;
    danger: string;
    success: string;
    ring: string;
  }
> = {
  emerald: {
    primary: "bg-emerald-700 text-white hover:bg-emerald-600",
    secondary: "bg-white text-emerald-900 hover:bg-emerald-100",
    ghost: "bg-transparent text-emerald-700 hover:bg-emerald-50",
    outline: "border bg-emerald-700 border-emerald-300 text-emerald-800 hover:bg-emerald-50",
    danger: "bg-red-600 text-white hover:bg-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
    ring: "focus-visible:ring-emerald-500",
  },
  blue: {
    primary: "bg-[#2E7DAF] text-white hover:opacity-50",
    secondary: "bg-blue-100 text-blue-900 hover:bg-blue-200",
    ghost: "bg-transparent text-blue-700 hover:bg-blue-50",
    outline: "border border-blue-300 text-blue-800 hover:bg-blue-50",
    danger: "bg-red-600 text-white hover:bg-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
    ring: "focus-visible:ring-blue-500",
  },
  slate: {
    primary: "bg-slate-800 text-white hover:bg-slate-700",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    outline: "border border-[#6B7280] text-[#374151] hover:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
    ring: "focus-visible:ring-slate-500",
  },
  red: {
    primary: "bg-red-700 text-white hover:bg-red-600",
    secondary: "bg-red-100 text-red-900 hover:bg-red-200",
    ghost: "bg-transparent text-red-700 hover:bg-red-50",
    outline: "border border-red-300 text-red-800 hover:bg-red-50",
    danger: "bg-red-700 text-white hover:bg-red-600",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
    ring: "focus-visible:ring-red-500",
  },
  amber: {
    primary: "bg-[#F59E0B] text-[#000000] hover:bg-[#D97706]",
    secondary: "bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A]",
    ghost: "bg-transparent text-[#B45309] hover:bg-[#FFFBEB]",
    outline: "border border-[#F59E0B] text-[#92400E] hover:bg-[#FFFBEB]",
    danger: "bg-red-700 text-white hover:bg-red-600",
    success: "bg-emerald-600 text-white hover:bg-emerald-500",
    ring: "focus-visible:ring-[#F59E0B]",
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs",
  sm: "h-9 px-4 text-sm",
  default: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-base",
  xl: "h-12 px-7 text-base",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", color = "emerald", size = "default", ...props },
    ref
  ) => {
    const tokens = colorTokens[color];
    return (
      <button
        ref={ref}
        className={cn(baseStyles, tokens[variant], tokens.ring, sizeStyles[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
