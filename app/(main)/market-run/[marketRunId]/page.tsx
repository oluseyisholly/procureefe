"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Input } from "@/components/ui/input";
import { NameInitialBadge } from "@/components/ui/name-initial-badge";
import {
  getMarketRunReconciliationRecord,
  type MarketRunStatus,
} from "@/lib/market-run/reconciliation";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const STATUS_STYLES: Record<
  MarketRunStatus,
  { wrapperClassName: string; textClassName: string; dotClassName: string }
> = {
  Published: {
    wrapperClassName: "bg-[#F5ECFF]",
    textClassName: "text-[#A118C5]",
    dotClassName: "bg-[#CC3CFF]",
  },
  Closed: {
    wrapperClassName: "bg-[#FFF2F0]",
    textClassName: "text-[#D92D20]",
    dotClassName: "bg-[#F04438]",
  },
  Reconciled: {
    wrapperClassName: "bg-[#EAF2FF]",
    textClassName: "text-[#155EEF]",
    dotClassName: "bg-[#155EEF]",
  },
};

function formatNaira(value: number): string {
  return `₦${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatSignedNaira(value: number): string {
  if (value > 0) {
    return `+${formatNaira(value)}`;
  }

  if (value < 0) {
    return `-${formatNaira(Math.abs(value))}`;
  }

  return formatNaira(0);
}

function formatShortDate(value: string): string {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function asNumberOrNull(value: string): number | null {
  const normalized = value.trim().replace(/,/g, "");
  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export default function MarketRunRecordPage() {
  const router = useRouter();
  const params = useParams<{ marketRunId: string }>();
  const marketRunId = Array.isArray(params.marketRunId)
    ? params.marketRunId[0]
    : params.marketRunId;

  const record = useMemo(
    () => getMarketRunReconciliationRecord(marketRunId),
    [marketRunId],
  );

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [marketPriceDrafts, setMarketPriceDrafts] = useState<
    Record<string, string>
  >({});
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  if (!record) {
    return (
      <Card className="rounded-[8px] border border-[#E4E7EC] p-6">
        <p className="text-sm font-medium text-[#344054]">
          Market run record not found.
        </p>
        <Button
          type="button"
          className="mt-4"
          onClick={() => router.push("/market-run")}
        >
          Back to Market Runs
        </Button>
      </Card>
    );
  }

  const allSelected =
    record.items.length > 0 && selectedItemIds.length === record.items.length;

  const itemMarketTotals = record.items.reduce<Record<string, number | null>>(
    (accumulator, item) => {
      const total = item.units.reduce((sum, unit) => {
        const key = `${item.id}:${unit.id}`;
        const value = asNumberOrNull(marketPriceDrafts[key] ?? "");
        return sum + (value ?? 0);
      }, 0);

      const hasAnyEntry = item.units.some((unit) => {
        const key = `${item.id}:${unit.id}`;
        return asNumberOrNull(marketPriceDrafts[key] ?? "") !== null;
      });

      accumulator[item.id] = hasAnyEntry ? total : null;
      return accumulator;
    },
    {},
  );

  const hasAnyMarketPrice = Object.values(itemMarketTotals).some(
    (value) => value !== null,
  );

  const marketTotal = Object.values(itemMarketTotals).reduce(
    (sum, value) => (sum ?? 0) + (value ?? 0),
    0,
  ) || 0;
  const variance = marketTotal - record.budgetTotal;

  const handleConfirmReset = () => {
    setMarketPriceDrafts({});
    setIsResetModalOpen(false);
  };

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold leading-7 text-[#1F2933]">
            Market Runs
          </h3>
          <p className="text-base font-medium leading-6 text-[#98A2B3]">
            Reconcile actual market prices against budgeted prices
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-[8px] border border-[#F6E4B7] bg-[#FFF4DB] px-3 py-2 text-xs font-medium text-[#B54708]">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M7 4.66667V7M7 9.33333H7.00583M12.8333 7C12.8333 10.2217 10.2217 12.8333 7 12.8333C3.77834 12.8333 1.16667 10.2217 1.16667 7C1.16667 3.77834 3.77834 1.16667 7 1.16667C10.2217 1.16667 12.8333 3.77834 12.8333 7Z"
              stroke="#B54708"
              strokeWidth="0.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {record.itemsPendingReconciliation} items are pending reconciliation.
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1.8fr_1fr] gap-4">
        <Card className="rounded-[8px] border border-[#E4E7EC] p-3">
          <div className="rounded-[8px] border border-[#E4E7EC] bg-[#F9FAFB] p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#000000]">
                  #{record.id} • {record.title}
                </p>
                <div className="mt-2 grid grid-cols-4 gap-5">
                  <InfoBlock label="Order Date" value={formatShortDate(record.orderDate)} />
                  <InfoBlock label="Due Date" value={formatShortDate(record.dueDate)} />
                  <InfoBlock label="Total Items" value={String(record.totalItems)} />
                  <InfoBlock label="Budget Total" value={formatNaira(record.budgetTotal)} />
                </div>
              </div>

              <StatusPill status={record.status} />
            </div>
          </div>

          <div className="mt-3 border border-[#E4E7EC] bg-white">
            <div className="flex items-center gap-3 border-b border-[#E4E7EC] px-5 py-2">
              <Checkbox
                checked={allSelected}
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelectedItemIds(record.items.map((item) => item.id));
                    return;
                  }
                  setSelectedItemIds([]);
                }}
              />
              <span className="text-xs font-medium text-[#344054]">Select all</span>
            </div>

            <div className="max-h-[420px] space-y-2 overflow-y-auto p-2">
              {record.items.map((item) => {
                const isExpanded = expandedItemId === item.id;
                const isSelected = selectedItemIds.includes(item.id);

                return (
                  <div key={item.id} className="rounded-[8px] border border-[#E4E7EC] bg-[#F9FAFB] px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            setSelectedItemIds((current) => [...current, item.id]);
                            return;
                          }

                          setSelectedItemIds((current) =>
                            current.filter((currentId) => currentId !== item.id),
                          );
                        }}
                      />

                      <NameInitialBadge name={item.name} />

                      <div className="grid flex-1 grid-cols-[1.2fr_1fr_0.8fr_1fr] gap-3">
                        <div className="flex h-full items-center">
                          <p className="text-sm font-medium text-[#1F2933]">{item.name}</p>
                        </div>
                        <InfoBlock
                          label="Total Requested Quantity"
                          value={item.requestedQuantityLabel}
                        />
                        <InfoBlock
                          label="Total Requesters"
                          value={String(item.totalRequesters)}
                        />
                        <InfoBlock label="Budget cost" value={formatNaira(item.budgetCost)} />
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedItemId((current) =>
                            current === item.id ? null : item.id,
                          )
                        }
                        className="inline-flex h-8 w-8 items-center justify-center text-[#667085]"
                        aria-label={isExpanded ? "Collapse item" : "Expand item"}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={cn(
                            "transition-transform",
                            isExpanded ? "rotate-180" : "",
                          )}
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {isExpanded ? (
                      <div className="mt-3 rounded-[8px] border border-[#E4E7EC] bg-white px-4 py-3">
                        <div className="space-y-2">
                          {item.units.map((unit) => {
                            const draftKey = `${item.id}:${unit.id}`;

                            return (
                              <div
                                key={unit.id}
                                className="grid grid-cols-[90px_1fr_1fr_190px] items-center gap-4"
                              >
                                <p className="text-sm font-medium text-[#344054]">
                                  {unit.unit}
                                </p>

                                <InfoBlock
                                  label="Budget cost"
                                  value={formatNaira(unit.budgetCost)}
                                />

                                <InfoBlock
                                  label="Requested Quantity"
                                  value={String(unit.requestedQty)}
                                />

                                <div className="space-y-1">
                                  <p className="text-[10px] font-medium text-[#667085]">
                                    Enter Market Price
                                  </p>
                                  <Input
                                    value={marketPriceDrafts[draftKey] ?? ""}
                                    onChange={(event) =>
                                      setMarketPriceDrafts((current) => ({
                                        ...current,
                                        [draftKey]: event.target.value,
                                      }))
                                    }
                                    placeholder={formatNaira(unit.budgetCost)}
                                    className="h-10 rounded-[4px] border-[#D0D5DD]"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Button
              type="button"
              color="slate"
              variant="outline"
              className="w-[120px]"
              onClick={() => router.push("/market-run")}
            >
              Back
            </Button>
            <Button
              type="button"
              color="slate"
              variant="outline"
              disabled={!hasAnyMarketPrice}
              className="w-[120px]"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              color="slate"
              variant="outline"
              disabled={!hasAnyMarketPrice}
              className="w-[120px]"
              onClick={() => setIsResetModalOpen(true)}
            >
              Reset
            </Button>
            <Button
              type="button"
              disabled={!hasAnyMarketPrice}
              className="ml-auto w-[120px] bg-[#6EA591] text-white hover:bg-[#639A86]"
            >
              Reconcile
            </Button>
          </div>
        </Card>

        <Card className="rounded-[8px] border border-[#E5E7EB] p-3">
          <h4 className="text-[16px] font-[500] text-[#1F2933]">
            Reconciliation summary
          </h4>
          <p className="mt-1 text-[11px] text-[#9CA3AF]">
            #{record.id} • {record.title}
          </p>

          <div className="mt-3 rounded-[8px] border border-[#E4E7EC] bg-[#F9FAFB] p-3">
            <div className="grid grid-cols-3 gap-3">
              <InfoBlock label="Budget Total" value={formatNaira(record.budgetTotal)} />
              <InfoBlock
                label="Market Total"
                value={hasAnyMarketPrice ? formatNaira(marketTotal) : "----------"}
              />
              <InfoBlock
                label="Variance"
                value={hasAnyMarketPrice ? formatSignedNaira(variance) : "----------"}
                valueClassName={
                  !hasAnyMarketPrice
                    ? undefined
                    : variance > 0
                      ? "text-[#DC2626]"
                      : variance < 0
                        ? "text-[#16A34A]"
                        : "text-[#000000]"
                }
              />
            </div>
          </div>

          <p className="mt-3 text-xs font-[500] text-[#9CA3AF]">Item comparison</p>

          <div className="mt-2 max-h-[460px] overflow-y-auto rounded-[8px] border border-[#E4E7EC]">
            <div className="grid grid-cols-[1fr_1.2fr_1.2fr] bg-[#F9FAFB] uppercase px-3 py-2 text-[13px] font-semibold text-[#1F2933]">
              <p>Item</p>
              <p>Budget</p>
              <p>Market</p>
            </div>

            {record.items.map((item) => (
              (() => {
                const marketTotalForItem = itemMarketTotals[item.id];
                const itemVariance =
                  marketTotalForItem === null
                    ? null
                    : marketTotalForItem - item.budgetCost;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_1.2fr_1.2fr] border-t border-[#E4E7EC] px-3 py-2"
                  >
                    <p className="text-xs font-medium text-[#344054]">{item.name}</p>
                    <ComparisonInfoColumn
                      amount={formatNaira(item.budgetCost)}
                      quantity={item.requestedQuantityLabel}
                    />
                    <ComparisonInfoColumn
                      amount={
                        marketTotalForItem === null
                          ? "----------"
                          : formatNaira(marketTotalForItem)
                      }
                      amountMeta={
                        itemVariance === null ? undefined : formatSignedNaira(itemVariance)
                      }
                      amountMetaInline
                      amountMetaClassName={
                        itemVariance === null
                          ? undefined
                          : itemVariance > 0
                            ? "text-[#DC2626]"
                            : itemVariance < 0
                              ? "text-[#16A34A]"
                              : "text-[#344054]"
                      }
                      quantity={
                        marketTotalForItem === null
                          ? "----------"
                          : item.requestedQuantityLabel
                      }
                      quantityClassName={
                        marketTotalForItem === null ? undefined : "text-[#155EEF]"
                      }
                    />
                  </div>
                );
              })()
            ))}
          </div>

          <div className="mt-3 flex justify-end">
            <Button type="button" color="slate" variant="outline" className="w-[146px]">
              Download as PDF
            </Button>
          </div>
        </Card>
      </div>
      <DeleteConfirmationModal
        open={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        tone="warning"
        title="Are you sure?"
        description="This will reset Market price for selected items. This action cannot be undone."
        confirmLabel="Yes, Reset"
        cancelLabel="No, Cancel"
      />
    </>
  );
}

function InfoBlock({
  label,
  value,
  valueClassName,
  metaValue,
  metaValueClassName,
  metaInline,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  metaValue?: string;
  metaValueClassName?: string;
  metaInline?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="text-[11px] text-[#9CA3AF]">{label}</p>
        {metaInline && metaValue ? (
          <p className={cn("text-[11px] font-medium text-[#344054]", metaValueClassName)}>
            {metaValue}
          </p>
        ) : null}
      </div>
      {!metaInline && metaValue ? (
        <p className={cn("text-[11px] font-medium text-[#344054]", metaValueClassName)}>
          {metaValue}
        </p>
      ) : null}
      <p className={cn("text-[11px] font-medium text-[#000000]", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

function ComparisonInfoColumn({
  amount,
  quantity,
  amountMeta,
  amountMetaClassName,
  amountMetaInline,
  amountClassName,
  quantityClassName,
}: {
  amount: string;
  quantity: string;
  amountMeta?: string;
  amountMetaClassName?: string;
  amountMetaInline?: boolean;
  amountClassName?: string;
  quantityClassName?: string;
}) {
  return (
    <div className="space-y-2">
      <InfoBlock
        label="Amount"
        value={amount}
        valueClassName={amountClassName}
        metaValue={amountMeta}
        metaValueClassName={amountMetaClassName}
        metaInline={amountMetaInline}
      />
      <InfoBlock label="Quantity" value={quantity} valueClassName={quantityClassName} />
    </div>
  );
}

function StatusPill({ status }: { status: MarketRunStatus }) {
  const statusStyle = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        statusStyle.wrapperClassName,
        statusStyle.textClassName,
      )}
    >
      <span className={cn("h-2 w-2 rounded-full", statusStyle.dotClassName)} />
      {status}
    </span>
  );
}
