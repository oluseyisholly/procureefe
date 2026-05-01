"use client";

import { SVGProps, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { SnackbarVariant } from "@/store";

type SnackbarTone = {
  panel: string;
  icon: string;
  title: string;
  message: string;
  close: string;
};

const snackbarToneMap: Record<SnackbarVariant, SnackbarTone> = {
  success: {
    panel: "border-[#CCE0D7] border-l-emerald-500 bg-[#D4E9E2]",
    icon: "text-emerald-600",
    title: "text-[#1F2933]",
    message: "text-[#344054]",
    close: "text-emerald-700 hover:bg-emerald-100",
  },
  error: {
    panel: "border-[#F4CBD2] border-l-red-500 bg-[#FCEBED]",
    icon: "text-red-600",
    title: "text-[#7A271A]",
    message: "text-[#B42318]",
    close: "text-red-700 hover:bg-red-100",
  },
  info: {
    panel: "border-[#C6DBF3] border-l-sky-500 bg-[#E8F2FC]",
    icon: "text-sky-600",
    title: "text-[#1F2933]",
    message: "text-[#344054]",
    close: "text-sky-700 hover:bg-sky-100",
  },
};

function SnackbarStatusIcon({
  variant,
  ...prop
}: SVGProps<SVGSVGElement> & {
  variant: SnackbarVariant;
}) {
  if (variant === "success") {
    return (
      <svg
        width="41"
        height="41"
        viewBox="0 0 41 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...prop}
      >
        <g clipPath="url(#clip0_463_473)">
          <path
            d="M17.0497 25.8681L32.7219 10.1943L35.1345 12.6051L17.0497 30.6898L6.19922 19.8393L8.61006 17.4285L17.0497 25.8681Z"
            fill="#16A34A"
          />
        </g>
        <defs>
          <clipPath id="clip0_463_473">
            <rect width="40.9195" height="40.9195" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  if (variant === "error") {
    return (
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        {...prop}
      >
        <path
          d="M17 11.3333V17M17 22.6667H17.0142M30.4584 17C30.4584 24.4338 24.4339 30.4583 17.0001 30.4583C9.56625 30.4583 3.54175 24.4338 3.54175 17C3.54175 9.56614 9.56625 3.54163 17.0001 3.54163C24.4339 3.54163 30.4584 9.56614 30.4584 17Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17 11.3333V17M17 22.6667H17.0142M30.4584 17C30.4584 24.4338 24.4339 30.4583 17.0001 30.4583C9.56625 30.4583 3.54175 24.4338 3.54175 17C3.54175 9.56614 9.56625 3.54163 17.0001 3.54163C24.4339 3.54163 30.4584 9.56614 30.4584 17Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SnackbarHost() {
  const { currentSnackbar, dismissSnackbar } = useAppStore(
    useShallow((state) => ({
      currentSnackbar: state.currentSnackbar,
      dismissSnackbar: state.dismissSnackbar,
    })),
  );

  useEffect(() => {
    if (!currentSnackbar) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dismissSnackbar();
    }, currentSnackbar.durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentSnackbar, dismissSnackbar]);

  if (!currentSnackbar) {
    return null;
  }

  const tone = snackbarToneMap[currentSnackbar.variant];

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[3200] flex justify-center sm:left-auto sm:right-6 w-full sm:max-w-[300px]">
      <div
        role={currentSnackbar.variant === "error" ? "alert" : "status"}
        aria-live={currentSnackbar.variant === "error" ? "assertive" : "polite"}
        className={cn(
          "pointer-events-auto w-full rounded-[8px]  border-l-[6px] px-6 py-2 shadow-[0_16px_28px_rgba(15,23,42,0.18)]",
          tone.panel,
        )}
      >
        <div className="flex  justify-end gap-3">
          <span className={cn("shrink-0 flex items-center", tone.icon)}>
            <SnackbarStatusIcon
              className="h-6 w-6"
              variant={currentSnackbar.variant}
            />
          </span>

          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-[16px] font-[500] text-[#1F2933]",
                tone.title,
              )}
            >
              {currentSnackbar.title}
            </p>
            <p
              className={cn(
                "mt-1 text-[11px] font-[400] text-[#1F2933]",
                tone.message,
              )}
            >
              {currentSnackbar.message}
            </p>
          </div>

          <button
            type="button"
            onClick={dismissSnackbar}
            aria-label="Dismiss notification"
            className={cn(
              "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] transition-colors",
              tone.close,
            )}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
