"use client";

import type { ReactNode } from "react";
import { DeleteWarningIcon } from "../icons/delete-warning";
import { Button } from "./button";
import { Modal } from "./modal";

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
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <DeleteWarningIcon className="h-6 w-6" />
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
              color="red"
              className="h-11 flex-1 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            >
              {isSubmitting ? "Deleting..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
