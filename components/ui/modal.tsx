"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { CancelIcon } from "../icons/cancelIcon";
import { IconButton } from "./icon-button";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  panelClassName?: string;
  backdropClassName?: string;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  panelClassName,
  backdropClassName,
  closeOnBackdropClick = true,
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        onClick={closeOnBackdropClick ? onClose : undefined}
        className={cn(
          "absolute inset-0 bg-black/45 backdrop-blur-md",
          backdropClassName,
        )}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative z-10 w-full max-w-[700px] rounded-[10px] border border-slate-200 bg-white p-4 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.6)] sm:p-5",
          panelClassName,
        )}
      >
        {showCloseButton ? (
          <IconButton
            label="Close modal"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex  items-center justify-center "
          >
            <CancelIcon className="h-[30px]" />
          </IconButton>
        ) : null}

        {title ? (
          <h2
            id={titleId}
            className="border-b border-[#E5E7EB] pt-[10px] pb-[20px] font-[700] text-[13px] leading-[20px] uppercase tracking-normal"
          >
            {title}
          </h2>
        ) : null}

        {description ? (
          <p
            id={descriptionId}
            className={cn(
              "mt-2 pr-8 text-[11px] leading-5 text-slate-500",
              title ? "" : "mt-0",
            )}
          >
            {description}
          </p>
        ) : null}

        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

type ModalSectionProps = HTMLAttributes<HTMLDivElement>;

export function ModalBody({ className, ...props }: ModalSectionProps) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

export function ModalFooter({ className, ...props }: ModalSectionProps) {
  return (
    <div
      className={cn("mt-5 flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}
