"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TableRowData = Record<string, unknown>;
type ColumnAlign = "left" | "center" | "right";
type PaginationItem = number | "ellipsis";

const alignStyles: Record<ColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export type DataTableColumn<T extends TableRowData> = {
  id: string;
  header: ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T, rowIndex: number) => ReactNode;
  align?: ColumnAlign;
  headerClassName?: string;
  cellClassName?: string;
};

export type DataTablePagination = {
  mode?: "local";
  pageSize?: number;
  initialPage?: number;
};

export type DataTableServerPagination = {
  mode: "server";
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
};

export type DataTableProps<T extends TableRowData> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey?: keyof T | ((row: T, rowIndex: number) => string);
  pagination?: DataTablePagination | DataTableServerPagination;
  emptyState?: ReactNode;
  variant?: "default" | "clean" | "soft";
  className?: string;
  tableClassName?: string;
};

export function DataTable<T extends TableRowData>({
  columns,
  rows,
  rowKey,
  pagination,
  emptyState = "No records available.",
  variant = "default",
  className,
  tableClassName,
}: DataTableProps<T>) {
  const localPagination =
    pagination?.mode === "server" ? null : (pagination as DataTablePagination | undefined);
  const serverPagination =
    pagination?.mode === "server"
      ? (pagination as DataTableServerPagination)
      : null;
  const pageSize = localPagination?.pageSize ?? 6;
  const [currentPage, setCurrentPage] = useState(localPagination?.initialPage ?? 1);

  const totalPages = serverPagination
    ? Math.max(1, serverPagination.totalPages)
    : Math.max(1, Math.ceil(rows.length / pageSize));
  const activePage = serverPagination
    ? Math.max(1, Math.min(serverPagination.currentPage, totalPages))
    : currentPage;

  const pageRows = useMemo(() => {
    if (serverPagination) {
      return rows;
    }

    const start = (activePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, serverPagination, activePage, pageSize]);

  const pageItems = useMemo(
    () => getPaginationItems(activePage, totalPages),
    [activePage, totalPages],
  );

  const onPageChange = (nextPage: number) => {
    const normalizedNextPage = Math.max(1, Math.min(nextPage, totalPages));

    if (serverPagination) {
      if (normalizedNextPage !== activePage) {
        serverPagination.onPageChange(normalizedNextPage);
      }
      return;
    }

    setCurrentPage(normalizedNextPage);
  };

  return (
    <div className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className={cn("min-w-full border-separate border-spacing-0 text-sm", tableClassName)}>
          <thead>
            <tr
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                variant === "default" && "bg-slate-200 text-slate-500",
                variant === "clean" && "bg-[#D1D5DB] text-[#111827]",
                variant === "soft" && "bg-[#D1D5DB] text-[#6B7280]",
              )}
            >
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "px-4 py-3",
                    variant === "default" &&
                      "border-b border-r border-slate-300 last:border-r-0",
                    alignStyles[column.align ?? "left"],
                    // "first:rounded-tl-lg last:rounded-tr-lg",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">
                  {emptyState}
                </td>
              </tr>
            ) : (
              pageRows.map((row, rowIndex) => (
                <tr
                  key={resolveRowKey(row, rowIndex, rowKey)}
                  className={cn(
                    "text-slate-700",
                    variant === "default" &&
                      (rowIndex % 2 === 0 ? "bg-slate-50" : "bg-slate-100/70"),
                    variant === "clean" && "bg-white",
                    variant === "soft" &&
                      (rowIndex % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F8FAFC]"),
                    "last:border-b-0"
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        "px-4 py-3 align-middle",
                        variant === "default" &&
                          "border-b border-r border-slate-200 last:border-r-0",
                        alignStyles[column.align ?? "left"],
                        column.cellClassName
                      )}
                    >
                      {renderCell(row, rowIndex, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 px-4 py-4 text-sm text-slate-600">
          <button
            type="button"
            onClick={() => onPageChange(activePage - 1)}
            disabled={activePage === 1 || serverPagination?.isLoading}
            className={cn(
              "px-1 transition-colors",
              activePage === 1 || serverPagination?.isLoading
                ? "cursor-not-allowed text-slate-400"
                : "hover:text-slate-900"
            )}
          >
            Prev
          </button>

          {pageItems.map((item, index) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1 text-slate-500">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                disabled={serverPagination?.isLoading}
                className={cn(
                  "h-8 min-w-8 rounded-md border px-2 transition-colors",
                  item === activePage
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
                )}
                aria-current={item === activePage ? "page" : undefined}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(activePage + 1)}
            disabled={activePage === totalPages || serverPagination?.isLoading}
            className={cn(
              "px-1 transition-colors",
              activePage === totalPages || serverPagination?.isLoading
                ? "cursor-not-allowed text-slate-400"
                : "hover:text-slate-900"
            )}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}

function renderCell<T extends TableRowData>(row: T, rowIndex: number, column: DataTableColumn<T>): ReactNode {
  if (column.cell) {
    return column.cell(row, rowIndex);
  }

  if (column.accessorKey) {
    return row[column.accessorKey] as ReactNode;
  }

  return null;
}

function resolveRowKey<T extends TableRowData>(
  row: T,
  rowIndex: number,
  rowKey?: keyof T | ((row: T, rowIndex: number) => string)
): string {
  if (typeof rowKey === "function") {
    return rowKey(row, rowIndex);
  }

  if (rowKey) {
    return String(row[rowKey]);
  }

  return String(rowIndex);
}

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}
