"use client";

import { EditIcon } from "@/components/icons/edit";
import { MarketRunHeader } from "@/components/marketRun/header-marketrun";
import ReviewItemRow, { type ReviewItem } from "@/components/marketRun/reviewItemRow";
import ReviewSummaryRow from "@/components/marketRun/reviewSummaryRow";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { getApiErrorMessage } from "@/lib/api";
import {
  useCreateMarketRunMutation,
  useUpdateMarketRunMutation,
  useUpdatePublishMarketRunMutation,
} from "@/lib/api/market-runs";
import { type MarketRunCommodityDraft, useMarketRunFlowStore } from "@/store";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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

function getComparableMaxQty(value: number | null): number {
  if (value === null) {
    return -1;
  }

  return value;
}

function getUnitMultiplier(draft: MarketRunCommodityDraft): number | null {
  const multiplier = draft.unitMultiplier;
  if (!Number.isFinite(multiplier) || !multiplier || multiplier <= 0) {
    return null;
  }

  return multiplier;
}

function selectLeastUnitDraft(
  drafts: MarketRunCommodityDraft[],
): MarketRunCommodityDraft {
  const flaggedLeastUnit = drafts.find((draft) => draft.isLeastUnit);
  if (flaggedLeastUnit) {
    return flaggedLeastUnit;
  }

  const exactLeastUnit = drafts.find((draft) => getUnitMultiplier(draft) === 1);
  if (exactLeastUnit) {
    return exactLeastUnit;
  }

  return [...drafts].sort((a, b) => {
    const multiplierA = getUnitMultiplier(a) ?? Number.POSITIVE_INFINITY;
    const multiplierB = getUnitMultiplier(b) ?? Number.POSITIVE_INFINITY;
    if (multiplierA !== multiplierB) {
      return multiplierA - multiplierB;
    }

    if (a.maxQty !== b.maxQty) {
      return getComparableMaxQty(b.maxQty) - getComparableMaxQty(a.maxQty);
    }

    if (a.minQty !== b.minQty) {
      return b.minQty - a.minQty;
    }

    return a.commodityUnitName.localeCompare(b.commodityUnitName);
  })[0];
}

function sortByUnitSize(
  a: MarketRunCommodityDraft,
  b: MarketRunCommodityDraft,
): number {
  const multiplierA = getUnitMultiplier(a) ?? Number.POSITIVE_INFINITY;
  const multiplierB = getUnitMultiplier(b) ?? Number.POSITIVE_INFINITY;

  if (multiplierA !== multiplierB) {
    return multiplierA - multiplierB;
  }

  return a.commodityUnitName.localeCompare(b.commodityUnitName);
}

export default function MarketRunReviewPage() {
  const router = useRouter();
  const createMarketRunMutation = useCreateMarketRunMutation();
  const updateMarketRunMutation = useUpdateMarketRunMutation();
  const updatePublishMarketRunMutation = useUpdatePublishMarketRunMutation();
  const [publishError, setPublishError] = useState<string | null>(null);
  const {
    marketRunFlowMode,
    editingMarketRunId,
    marketRunDetailsDraft,
    marketRunCommodityDrafts,
    resetMarketRunFlow,
  } = useMarketRunFlowStore();
  const isUpdateMode = marketRunFlowMode === "update";
  const isMutationPending =
    createMarketRunMutation.isPending ||
    updateMarketRunMutation.isPending ||
    updatePublishMarketRunMutation.isPending;

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

  const reviewItems = useMemo<ReviewItem[]>(() => {
    const groupedDrafts = new Map<string, MarketRunCommodityDraft[]>();

    for (const draft of marketRunCommodityDrafts) {
      const currentDrafts = groupedDrafts.get(draft.commodityId) ?? [];
      groupedDrafts.set(draft.commodityId, [...currentDrafts, draft]);
    }

    return Array.from(groupedDrafts.entries()).map(([commodityId, drafts]) => {
      const leastUnitDraft = selectLeastUnitDraft(drafts);
      const additionalUnits = drafts
        .filter((draft) => draft.id !== leastUnitDraft.id)
        .sort(sortByUnitSize)
        .map((draft) => ({
          unit: draft.commodityUnitName,
          price: formatNaira(draft.pricePerUnit),
        }));

      return {
        id: commodityId,
        name: leastUnitDraft.commodityName,
        baseUnit: leastUnitDraft.commodityUnitName,
        basePrice: formatNaira(leastUnitDraft.pricePerUnit),
        minimumOrder: String(leastUnitDraft.minQty),
        maximumOrder:
          leastUnitDraft.maxQty === null
            ? "No Maximum Order"
            : String(leastUnitDraft.maxQty),
        additionalUnits,
      };
    });
  }, [marketRunCommodityDrafts]);

  const canPublish =
    Boolean(marketRunDetailsDraft.description.trim()) &&
    Boolean(marketRunDetailsDraft.bookingEndDate) &&
    Boolean(marketRunDetailsDraft.marketRunDate) &&
    marketRunCommodityDrafts.length > 0;

  function buildMarketRunPayload() {
    return {
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
    };
  }

  async function handleSaveDraft() {
    setPublishError(null);

    if (!isUpdateMode || !editingMarketRunId) {
      setPublishError("This market run is not in edit mode.");
      return;
    }

    if (!canPublish) {
      setPublishError(
        "Complete run details and add at least one commodity unit before saving.",
      );
      return;
    }

    try {
      await updateMarketRunMutation.mutateAsync({
        id: editingMarketRunId,
        ...buildMarketRunPayload(),
      });

      resetMarketRunFlow();
      router.push("/dashboard");
    } catch (error) {
      setPublishError(getApiErrorMessage(error, "Unable to update market run."));
    }
  }

  async function handlePublish() {
    setPublishError(null);

    if (!canPublish) {
      setPublishError(
        "Complete run details and add at least one commodity unit before publishing.",
      );
      return;
    }

    try {
      if (isUpdateMode) {
        if (!editingMarketRunId) {
          setPublishError("This market run is not in edit mode.");
          return;
        }

        await updatePublishMarketRunMutation.mutateAsync({
          id: editingMarketRunId,
          ...buildMarketRunPayload(),
        });
      } else {
        await createMarketRunMutation.mutateAsync(buildMarketRunPayload());
      }

      resetMarketRunFlow();
      router.push("/dashboard");
    } catch (error) {
      setPublishError(
        getApiErrorMessage(
          error,
          isUpdateMode
            ? "Unable to update and publish market run."
            : "Unable to publish market run.",
        ),
      );
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
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
          <Button
            type="button"
            color="slate"
            variant="primary"
            className="bg-[#6B7280] text-white hover:bg-[#5F6774]"
            onClick={() => router.push("/market-run/item")}
          >
            Back: Items
          </Button>
          <Button
            type="button"
            color="blue"
            onClick={() => void handleSaveDraft()}
            disabled={!isUpdateMode || !canPublish || isMutationPending}
          >
            {updateMarketRunMutation.isPending ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={isMutationPending}
          >
            {createMarketRunMutation.isPending
              ? "Publishing..."
              : updatePublishMarketRunMutation.isPending
                ? "Updating..."
                : isUpdateMode
                  ? "Update & Publish Market Run"
                  : "Publish Market Run"}
          </Button>
        </div>
      </div>
    </div>
  );
}
