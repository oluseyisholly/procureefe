"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { DeleteWarningIcon } from "../icons/delete-warning";
import { Button } from "./button";
import { Modal } from "./modal";

type ConfirmationTone = "danger" | "warning";

export type DeleteConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  title?: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  tone?: ConfirmationTone;
};

export function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  itemName = "this item",
  title = "Are you sure?",
  description,
  confirmLabel = "Yes, Delete",
  cancelLabel = "No, Cancel",
  isSubmitting = false,
  tone = "danger",
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseButton={false}
      closeOnBackdropClick={false}
      panelClassName="!max-w-[384px] rounded-[8px] border border-[#D0D5DD] px-8 pb-8 pt-10 sm:px-10 sm:pb-10"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <span
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-full",
              tone === "warning" ? "bg-[#F59E0B1A]" : "bg-red-50",
            )}
          >
            {tone === "warning" ? (
              <WarningConfirmationIcon className="h-6 w-6" />
            ) : (
              <DeleteWarningIcon className="h-6 w-6" />
            )}
          </span>

          <h2 className="mt-5 text-[16px] font-[600] leading-[40px] text-[#1F2933]">
            {title}
          </h2>

          <p className="mt-2 max-w-[420px] text-[14px] font-[400] leading-6 text-[#4B5563]">
            {description ?? (
              <>
                You are going to delete{" "}
                <span className="font-[600] text-[#1F2933]">{itemName}</span>.
                {" "}This action cannot be undone.
              </>
            )}
          </p>
        </div>

        <div className="border-t border-[#E5E7EB] pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              color="slate"
              className="h-11 flex-1 border-[#9CA3AF] bg-white  text-[#374151]"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              color={tone === "danger" ? "red" : "amber"}
              className={cn(
                "h-11 flex-1",
                tone === "danger" && "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
              )}
            >
              {isSubmitting
                ? tone === "warning"
                  ? "Resetting..."
                  : "Deleting..."
                : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function WarningConfirmationIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11.9998 9.00023V13.0002M11.9998 17.0002H12.0098M10.6151 3.89195L2.39019 18.0986C1.93398 18.8866 1.70588 19.2806 1.73959 19.6039C1.769 19.886 1.91677 20.1423 2.14613 20.309C2.40908 20.5002 2.86435 20.5002 3.77487 20.5002H20.2246C21.1352 20.5002 21.5904 20.5002 21.8534 20.309C22.0827 20.1423 22.2305 19.886 22.2599 19.6039C22.2936 19.2806 22.0655 18.8866 21.6093 18.0986L13.3844 3.89195C12.9299 3.10679 12.7026 2.71421 12.4061 2.58235C12.1474 2.46734 11.8521 2.46734 11.5935 2.58235C11.2969 2.71421 11.0696 3.10679 10.6151 3.89195Z"
        stroke="#F59E0B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
