"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ItemViewConversion = {
  unitName: string;
  value: string;
};

type ItemViewModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  itemName: string;
  categoryName: string;
  baseUnitName: string;
  conversions: ItemViewConversion[];
};

export function ItemViewModal({
  open,
  onClose,
  onEdit,
  itemName,
  categoryName,
  baseUnitName,
  conversions,
}: ItemViewModalProps) {
  const initials = itemName
    .trim()
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="View Item"
      panelClassName="!max-w-[560px] rounded-[10px] border border-[#D0D5DD] px-6 pb-6 pt-2"
    >
      <div className="space-y-6">
        <div className="flex justify-center pt-1">
          <span
            aria-label={`${itemName} initials`}
            className="inline-flex h-[88px] w-[88px] items-center justify-center rounded-[26px] bg-[#E4E7EC] text-[28px] font-semibold leading-none text-[#344054]"
          >
            {initials || "-"}
          </span>
        </div>

        <div className="rounded-[8px] text-[14px] font-[400] bg-[#F2F4F7] px-4 py-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <p className=" text-[##6B7280]">Item Name</p>
              <p className=" font-[500] text-[#1F2933]">{itemName}</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className=" text-[##6B7280]">Category</p>
              <p className=" font-[500] text-[#1F2933]">{categoryName}</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className=" text-[#6B7280]">Base Unit (Smallest unit)</p>
              <p className=" font-[500] text-[#1F2933]">{baseUnitName}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            Conversions
          </p>
          <div className="mt-2 text-[14px] rounded-[8px] bg-[#F2F4F7] px-4 py-3">
            {conversions.length ? (
              <div className="space-y-2.5">
                {conversions.map((conversion) => (
                  <div
                    key={conversion.unitName}
                    className="flex items-center justify-between gap-4"
                  >
                    <p className=" text-[#6B7280]">{conversion.unitName}</p>
                    <p className=" font-[500] text-[#1F2933]">
                      {conversion.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#98A2B3]">No conversions available.</p>
            )}
          </div>
        </div>

        <div className="border-t border-[#E5E7EB] pt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={onEdit}
              variant="outline"
              color="slate"
              className="h-10 flex-1 border-[#9CA3AF] bg-white text-sm !font-[500] text-[#374151]"
            >
              Edit
            </Button>
            <Button
              type="button"
              onClick={onClose}
              color="slate"
              className="h-10 flex-1 !bg-[#374151] text-sm !font-[500] text-white hover:bg-[#2D3748]"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
