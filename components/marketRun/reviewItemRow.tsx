"use client";

import Image from "next/image";
import { useState } from "react";

export type ReviewItemAdditionalUnit = {
  unit: string;
  price: string;
};

export type ReviewItem = {
  id: string;
  name: string;
  baseUnit: string;
  basePrice: string;
  minimumOrder: string;
  maximumOrder: string;
  additionalUnits: ReviewItemAdditionalUnit[];
};

export default function ReviewItemRow({ item }: { item: ReviewItem }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const canToggle = item.additionalUnits.length > 0;

  return (
    <div className="rounded-[8px] border border-[#E5E7EB] bg-[#FCFCFD] px-4 py-3">
      <div className="flex items-center gap-3">
        <Image src="/rice.svg" alt={item.name} width={50} height={50} />

        <div className="min-w-0 flex-1">
          <div className="grid grid-cols-4 items-center gap-4">
            <div>
              <p className="text-[14px] font-[500] text-[#1F2933]">{item.name}</p>
              <p className="text-[11px] font-[400] text-[#9CA3AF]">Base Unit</p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.baseUnit}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-[400] text-[#9CA3AF]">Base Price</p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.basePrice}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-[400] text-[#9CA3AF]">Minimum Order</p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.minimumOrder}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-[400] text-[#9CA3AF]">Maximum Order</p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.maximumOrder}
              </p>
            </div>
          </div>
        </div>

        {canToggle ? (
          <button
            type="button"
            onClick={() => setIsExpanded((current) => !current)}
            aria-label={isExpanded ? "Collapse unit prices" : "Expand unit prices"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#1F2933] transition-colors hover:bg-[#F2F4F7]"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={isExpanded ? "rotate-180" : ""}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#1F2933"
                strokeWidth="0.833333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </div>

      {item.additionalUnits.length && isExpanded ? (
        <div className="mt-3 border-t border-[#E4E7EC] pt-3">
          <div className="space-y-2">
            {item.additionalUnits.map((unit, index) => (
              <div
                key={`${unit.unit}-${index}`}
                className="grid grid-cols-[1fr_auto] items-center rounded-[4px] bg-[#F2F4F7] px-4 py-1.5"
              >
                <p className="text-[14px] font-[500] text-[#1F2933]">{unit.unit}</p>
                <p className="text-[14px] font-[500] text-[#1F2933]">{unit.price}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
