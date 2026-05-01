"use client";

import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { useField } from "formik";
import { IconButton } from "./icon-button";

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
>;

export type InputProps = NativeInputProps & {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  suffix_1?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, prefix, suffix, ...props }, ref) => {
    const isDateInput = props.type === "date";
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const openDatePicker = () => {
      if (!inputRef.current || !isDateInput) {
        return;
      }
      inputRef.current.focus();
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      }
    };

    return (
      <div
        className={cn(
          "flex w-full items-center rounded-lg border border-slate-300 bg-white focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-200",
          className,
        )}
      >
        {prefix ? (
          <span className="pl-4 text-xl leading-none text-slate-900">
            {prefix}
          </span>
        ) : null}
        <input
          ref={setInputRef}
          className={cn(
            "min-w-0 flex-1 rounded-lg bg-transparent px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
            prefix ? "pl-3" : "",
            suffix ? "pr-2" : "",
            isDateInput &&
              "appearance-none [color-scheme:light] [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-0",
          )}
          {...props}
        />
        {suffix ? (
          isDateInput ? (
            <IconButton
              label="Open date picker"
              onClick={openDatePicker}
              className="inline-flex shrink-0 items-center justify-center px-3 text-slate-500"
            >
              {suffix}
            </IconButton>
          ) : (
            <span className="shrink-0 px-3 text-slate-500">{suffix}</span>
          )
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

type FormikInputProps = Omit<InputProps, "name"> & {
  name: string;
  label?: string;
  helperText?: string;
};

export function FormikInput({
  name,
  label,
  helperText,
  className,
  prefix,
  suffix,
  suffix_1,
  id,
  ...props
}: FormikInputProps) {
  const [field, meta] = useField(name);
  const inputId = id ?? name;
  const showError = Boolean(meta.touched && meta.error);

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-600">
          {label}
        </label>
      ) : null}
      <div className={'flex items-center gap-[16px]'}>
        <Input
          id={inputId}
          className={cn(
            showError
              ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-100"
              : "",
            className,
          )}
          prefix={prefix}
          suffix={suffix}
          aria-invalid={showError}
          {...field}
          {...props}
          
        />
        {suffix_1}
      </div>

      {showError ? (
        <p className="text-[11px] text-red-600">{meta.error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#9CA3AF]">{helperText}</p>
      ) : null}
    </div>
  );
}

type SelectOption = {
  label: string;
  value: string;
};

type FormikSelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "name"
> & {
  name: string;
  label?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
};

export function FormikSelect({
  name,
  label,
  helperText,
  options,
  placeholder = "Select an option",
  className,
  id,
  ...props
}: FormikSelectProps) {
  const [field, meta] = useField(name);
  const inputId = id ?? name;
  const showError = Boolean(meta.touched && meta.error);

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-600">
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        className={cn(
          "w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60",
          showError
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "",
          className,
        )}
        aria-invalid={showError}
        {...field}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showError ? (
        <p className="text-xs text-red-600">{meta.error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
