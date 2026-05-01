"use client";

import {
  MarketRunDateFilterInput,
  MarketRunStatusFilterSelect,
} from "@/components/marketRun/market-run-filter-field";
import { EditIcon } from "@/components/icons/edit";
import { ViewIcon } from "@/components/icons/view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { useMarketRunsQuery } from "@/lib/api/market-runs";
import { useMarketRunFlowStore } from "@/store";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type MarketRunIndexTableRow = {
  id: string;
  description: string;
  orderDate: string;
  dueDate: string;
  items: string;
  members: string;
  status: string;
  totalAmount: string;
};

const FILTERABLE_STATUS_OPTIONS = [
  { label: "Saved", value: "Saved" },
  { label: "Open", value: "Open" },
  { label: "Closed", value: "Closed" },
  { label: "In Progress", value: "In Progress" },
  { label: "Cancelled", value: "Cancelled" },
];

function withFallback(value: string | null | undefined): string {
  const normalized = value?.trim();
  return normalized ? normalized : "-";
}

function formatStatus(value: string | null | undefined): string {
  const normalized = value?.trim();
  if (!normalized) {
    return "-";
  }

  return normalized
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
    .join(" ");
}

function formatDateAsDay(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return String(parsedDate.getDate());
}

function toDateValue(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.getTime();
}

function getStatusStyles(status: string) {
  switch (status) {
    case "Saved":
      return {
        wrapperClassName: "bg-[#F5ECFF]",
        textClassName: "text-[#A118C5]",
        dotClassName: "bg-[#CC3CFF]",
      };
    case "Closed":
      return {
        wrapperClassName: "bg-[#FFF2F0]",
        textClassName: "text-[#D92D20]",
        dotClassName: "bg-[#F04438]",
      };
    case "In Progress":
      return {
        wrapperClassName: "bg-[#EAF2FF]",
        textClassName: "text-[#155EEF]",
        dotClassName: "bg-[#155EEF]",
      };
    case "Open":
      return {
        wrapperClassName: "bg-[#ECFDF3]",
        textClassName: "text-[#027A48]",
        dotClassName: "bg-[#12B76A]",
      };
    case "Cancelled":
      return {
        wrapperClassName: "bg-[#F2F4F7]",
        textClassName: "text-[#475467]",
        dotClassName: "bg-[#98A2B3]",
      };
    default:
      return {
        wrapperClassName: "bg-[#F2F4F7]",
        textClassName: "text-[#475467]",
        dotClassName: "bg-[#98A2B3]",
      };
  }
}

export default function MarketRunIndexPage() {
  const router = useRouter();
  const { resetMarketRunFlow } = useMarketRunFlowStore();
  const [fromDateDraft, setFromDateDraft] = useState("");
  const [toDateDraft, setToDateDraft] = useState("");
  const [statusDraft, setStatusDraft] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");

  const marketRunsQuery = useMarketRunsQuery({
    page: 1,
    perPage: 200,
  });

  const rows = useMemo<MarketRunIndexTableRow[]>(() => {
    const marketRuns = marketRunsQuery.data?.data.data ?? [];

    return marketRuns.map((marketRun) => ({
      id: marketRun.id,
      description: withFallback(marketRun.name),
      orderDate: marketRun.requestStartDate ?? marketRun.created_at,
      dueDate: marketRun.requestEndDate ?? marketRun.marketRunDate,
      items: "-",
      members: "-",
      status: formatStatus(marketRun.status),
      totalAmount: "-",
    }));
  }, [marketRunsQuery.data]);

  const columns = useMemo<DataTableColumn<MarketRunIndexTableRow>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        cell: (row) => `#${row.id}`,
        headerClassName: "w-[72px]",
        cellClassName: "text-[#475467]",
      },
      { id: "description", header: "Description", accessorKey: "description" },
      {
        id: "orderDate",
        header: "Order Date",
        cell: (row) => formatDateAsDay(row.orderDate),
      },
      {
        id: "dueDate",
        header: "Due Date",
        cell: (row) => formatDateAsDay(row.dueDate),
      },
      { id: "items", header: "Items", accessorKey: "items" },
      { id: "members", header: "Members", accessorKey: "members" },
      {
        id: "status",
        header: "Status",
        cell: (row) => {
          const statusStyle = getStatusStyles(row.status);
          return (
            <span
              className={`inline-flex min-w-[98px] items-center justify-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${statusStyle.wrapperClassName} ${statusStyle.textClassName}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${statusStyle.dotClassName}`}
                aria-hidden
              />
              {row.status}
            </span>
          );
        },
      },
      {
        id: "totalAmount",
        header: "Total Amount",
        accessorKey: "totalAmount",
        cellClassName: "text-[#344054]",
      },
      {
        id: "actions",
        header: "Actions",
        align: "center",
        cellClassName: "text-[#667085]",
        cell: (row) => (
          <div className="flex items-center justify-center gap-2">
            <IconButton
              label={`View market run ${row.id}`}
              onClick={() => router.push(`/market-run/${row.id}`)}
              className="inline-flex items-center justify-center text-[#667085] transition-colors hover:text-[#475467]"
            >
              <ViewIcon className="h-4 w-4" />
            </IconButton>
            <IconButton
              label={`Edit market run ${row.id}`}
              onClick={() => router.push(`/market-run/${row.id}/edit`)}
              className="inline-flex items-center justify-center transition-opacity hover:opacity-80"
            >
              <EditIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    [router],
  );

  const filteredRows = useMemo(() => {
    const fromDateValue = fromDate ? toDateValue(fromDate) : null;
    const toDateValueFilter = toDate ? toDateValue(toDate) : null;

    return rows.filter((row) => {
      const statusMatches = status ? row.status === status : true;
      const orderDateValue = toDateValue(row.orderDate);
      const dueDateValue = toDateValue(row.dueDate);
      const fromDateMatches =
        fromDateValue === null || orderDateValue === null
          ? true
          : orderDateValue >= fromDateValue;
      const toDateMatches =
        toDateValueFilter === null || dueDateValue === null
          ? true
          : dueDateValue <= toDateValueFilter;

      return statusMatches && fromDateMatches && toDateMatches;
    });
  }, [fromDate, rows, status, toDate]);

  const emptyState = marketRunsQuery.isLoading
    ? "Loading market runs..."
    : marketRunsQuery.isError
      ? "Unable to load market runs."
      : "No market runs found.";

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold leading-7 text-[#1F2933]">
            Market Runs
          </h3>
          <p className="text-base font-medium leading-6 text-[#1F2933]">
            View and reconcile all market purchase periods
          </p>
        </div>

        <Button
          type="button"
          className="h-10 rounded-[8px]"
          onClick={() => {
            resetMarketRunFlow();
            router.push("/market-run/details");
          }}
        >
          Create Market runs
        </Button>
      </div>

      <Card className="mt-[20px] rounded-[8px] border border-[#E4E7EC] px-[22px] py-[20px]">
        <div className="rounded-[8px] border border-[#E4E7EC] bg-white px-3 py-3">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-end gap-[40px]">
              <MarketRunDateFilterInput
                label="From date"
                value={fromDateDraft}
                onChange={(event) => setFromDateDraft(event.target.value)}
                placeholder="select date"
              />

              <MarketRunDateFilterInput
                label="To date"
                value={toDateDraft}
                onChange={(event) => setToDateDraft(event.target.value)}
                placeholder="select date"
              />

              <MarketRunStatusFilterSelect
                label="Status"
                value={statusDraft}
                onChange={(event) => setStatusDraft(event.target.value)}
                options={FILTERABLE_STATUS_OPTIONS}
                placeholder="select status"
              />
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                color="slate"
                variant="outline"
                className="h-10 min-w-[160px]"
                onClick={() => {
                  setFromDate(fromDateDraft);
                  setToDate(toDateDraft);
                  setStatus(statusDraft);
                }}
              >
                Apply filter
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[8px] bg-white">
          <DataTable
            columns={columns}
            rows={filteredRows}
            rowKey="id"
            variant="soft"
            pagination={{ pageSize: 6 }}
            tableClassName="text-xs"
            emptyState={emptyState}
          />
        </div>
      </Card>
    </>
  );
}
