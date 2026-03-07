"use client";

import { EditIcon } from "@/components/icons/edit";
import { MarketRunHeader } from "@/components/marketRun/header-marketrun";
import ReviewItemRow, { type ReviewItem } from "@/components/marketRun/reviewItemRow";
import ReviewSummaryRow from "@/components/marketRun/reviewSummaryRow";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { getApiErrorMessage } from "@/lib/api";
import { useCreateMarketRunMutation } from "@/lib/api/market-runs";
import { useMarketRunFlowStore } from "@/store";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const REVIEW_ITEM_TONES: ReviewItem["tone"][] = ["amber", "sky", "rose"];

function formatNaira(value: number): string {
  return `₦${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateForSummary(value: string): string {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toApiDate(value: string): string {
  if (!value) {
    return "";
  }

  return `${value}T00:00:00Z`;
}

export default function MarketRunReviewPage() {
  const router = useRouter();
  const createMarketRunMutation = useCreateMarketRunMutation();
  const [publishError, setPublishError] = useState<string | null>(null);
  const {
    marketRunDetailsDraft,
    marketRunCommodityDrafts,
    resetMarketRunFlow,
  } = useMarketRunFlowStore();

  const reviewSummaryRows = useMemo(
    () => [
      {
        label: "Description",
        value: marketRunDetailsDraft.description || "-",
      },
      {
        label: "Market Run Date",
        value: formatDateForSummary(marketRunDetailsDraft.marketRunDate),
      },
      {
        label: "Booking End Date",
        value: formatDateForSummary(marketRunDetailsDraft.bookingEndDate),
      },
    ],
    [marketRunDetailsDraft],
  );

  const reviewItems = useMemo<ReviewItem[]>(
    () =>
      marketRunCommodityDrafts.map((draft, index) => ({
        id: draft.id,
        name: draft.commodityName,
        baseUnit: draft.commodityUnitName,
        basePrice: formatNaira(draft.pricePerUnit),
        minimumOrder: String(draft.minQty),
        maximumOrder: String(draft.maxQty),
        tone: REVIEW_ITEM_TONES[index % REVIEW_ITEM_TONES.length],
      })),
    [marketRunCommodityDrafts],
  );

  const canPublish =
    Boolean(marketRunDetailsDraft.description.trim()) &&
    Boolean(marketRunDetailsDraft.bookingEndDate) &&
    Boolean(marketRunDetailsDraft.marketRunDate) &&
    marketRunCommodityDrafts.length > 0;

  async function handlePublish() {
    setPublishError(null);

    if (!canPublish) {
      setPublishError(
        "Complete run details and add at least one commodity unit before publishing.",
      );
      return;
    }

    try {
      await createMarketRunMutation.mutateAsync({
        name: marketRunDetailsDraft.description.trim(),
        requestEndDate: toApiDate(marketRunDetailsDraft.bookingEndDate),
        marketRunDate: toApiDate(marketRunDetailsDraft.marketRunDate),
        marketRunCommodities: marketRunCommodityDrafts.map((draft) => ({
          pricePerUnit: draft.pricePerUnit,
          minQty: draft.minQty,
          maxQty: draft.maxQty,
          commodityUnitId: draft.commodityUnitId,
          commodityId: draft.commodityId,
        })),
      });

      resetMarketRunFlow();
      router.push("/dashboard");
    } catch (error) {
      setPublishError(getApiErrorMessage(error, "Unable to publish market run."));
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1005px] rounded-[10px] bg-white p-8">
      <MarketRunHeader
        title="Review & Publish"
        subtitle="Review and publish details before publishing"
      />

      <div className="mt-6 rounded-[10px] bg-[#F8FAFC] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            {reviewSummaryRows.map((row) => (
              <ReviewSummaryRow
                key={row.label}
                label={row.label}
                value={row.value}
              />
            ))}
          </div>

          <IconButton
            label="Edit run details"
            className="text-[#667085] transition-colors hover:text-[#475467]"
            onClick={() => router.push("/market-run/details")}
          >
            <EditIcon />
          </IconButton>
        </div>
      </div>

      <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1">
        {reviewItems.length ? (
          reviewItems.map((item) => <ReviewItemRow key={item.id} item={item} />)
        ) : (
          <div className="rounded-[8px] border border-dashed border-[#D0D5DD] p-4 text-sm text-[#667085]">
            No market run items yet. Add items from the previous step.
          </div>
        )}
      </div>

      {publishError ? (
        <p className="mt-4 text-sm text-red-600">{publishError}</p>
      ) : null}

      <div className="mt-6 border-t border-[#E4E7EC] pt-6">
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            color="slate"
            variant="outline"
            onClick={() => router.push("/market-run/item")}
          >
            Back
          </Button>
          <Button type="button" color="blue" disabled>
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={createMarketRunMutation.isPending}
          >
            {createMarketRunMutation.isPending
              ? "Publishing..."
              : "Publish Market Run"}
          </Button>
        </div>
      </div>
    </div>
  );
}
