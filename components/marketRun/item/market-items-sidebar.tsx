"use client";

import { DeleteIcon } from "@/components/icons/delete";
import { ViewIcon } from "@/components/icons/view";
import { MarketRunHeader } from "@/components/marketRun/header-marketrun";
import { IconButton } from "@/components/ui/icon-button";
import { formatNaira, type GroupedMarketItem } from "@/lib/market-run/item";

type MarketItemsSidebarProps = {
  items: GroupedMarketItem[];
  restoreError: string | null;
  restoringCommodityId: string | null;
  onView: (item: GroupedMarketItem) => void;
  onDelete: (commodityId: string) => void;
};

export function MarketItemsSidebar({
  items,
  restoreError,
  restoringCommodityId,
  onView,
  onDelete,
}: MarketItemsSidebarProps) {
  return (
    <aside className="border-l border-[#E4E7EC] overflow-scroll-y pl-8">
      <MarketRunHeader
        title=" Market Items"
        subtitle="View Market run items"
      />

      <div className="mt-6 space-y-3">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.commodityId}
              className="flex justify-between items-center rounded-[8px] border border-[#E4E7EC] bg-[#F8FAFC] px-3 py-2"
            >
              <div>
                <p className="text-base font-semibold text-[#475467]">
                  {item.commodityName}
                </p>
                <p className="mt-1 text-sm font-medium text-[#1F2933]">
                  {formatNaira(item.displayPricePerUnit)}{" "}
                  <span className="text-[#9CA3AF]">per</span>{" "}
                  {item.displayUnitName}
                </p>
                <p className="mt-1 text-xs text-[#98A2B3]">
                  Minimum order: {item.minimumOrder} {item.displayUnitName}
                </p>
                <p className="mt-1 text-xs text-[#98A2B3]">
                  We have {item.unitCount}{" "}
                  {item.unitCount === 1 ? "unit" : "units"} selected
                </p>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <IconButton
                  onClick={() => onView(item)}
                  disabled={restoringCommodityId === item.commodityId}
                  label={`View ${item.commodityName}`}
                  className="cursor-pointer text-[#98A2B3] transition-colors hover:text-[#667085]"
                >
                  <ViewIcon className="h-4 w-4" />
                </IconButton>
                <IconButton
                  onClick={() => onDelete(item.commodityId)}
                  label={`Remove ${item.commodityName}`}
                  className="cursor-pointer text-red-400 transition-colors hover:text-red-500"
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[#98A2B3]">No market items yet.</p>
        )}
      </div>

      {restoreError ? (
        <p className="mt-3 text-xs text-red-600">{restoreError}</p>
      ) : null}
    </aside>
  );
}
