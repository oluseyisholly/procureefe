"use client";

import { CalenderIcon } from "@/components/icons/calender";
import { Input, type InputProps } from "@/components/ui/input";
import { Select, type SelectOption, type SelectProps } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type MarketRunFilterFieldProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function MarketRunFilterField({
  label,
  className,
  children,
}: MarketRunFilterFieldProps) {
  return (
    <div className={cn("w-[204px] shrink-0 space-y-0.5", className)}>
      <label className="text-[10px] font-medium leading-[14px] text-[#667085]">
        {label}
      </label>
      {children}
    </div>
  );
}

type MarketRunDateFilterInputProps = Omit<InputProps, "type" | "suffix"> & {
  label: string;
};

export function MarketRunDateFilterInput({
  label,
  className,
  ...props
}: MarketRunDateFilterInputProps) {
  return (
    <MarketRunFilterField label={label}>
      <Input
        type="date"
        suffix={<CalenderIcon className="h-4 w-4" />}
        className={cn("h-[42px] rounded-[6px] border-[#D0D5DD]", className)}
        {...props}
      />
    </MarketRunFilterField>
  );
}

type MarketRunStatusFilterSelectProps = Omit<SelectProps, "options"> & {
  label: string;
  options: SelectOption[];
};

export function MarketRunStatusFilterSelect({
  label,
  options,
  className,
  ...props
}: MarketRunStatusFilterSelectProps) {
  return (
    <MarketRunFilterField label={label}>
      <Select
        options={options}
        className={cn("h-[42px] rounded-[6px] border-[#D0D5DD]", className)}
        {...props}
      />
    </MarketRunFilterField>
  );
}
