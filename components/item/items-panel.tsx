"use client";

import { DeleteIcon } from "@/components/icons/delete";
import { EditIcon } from "@/components/icons/edit";
import { ViewIcon } from "@/components/icons/view";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { NameInitialBadge } from "@/components/ui/name-initial-badge";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import {
  useCommoditiesQuery,
  useDeleteCommodityMutation,
  type Commodity,
  type CommodityUnit,
} from "@/lib/api/commodities";
import { getApiErrorMessage } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import { useItemFlowStore } from "@/store";
import { useSnackbar } from "@/store/hooks/use-snackbar";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ItemViewModal } from "./item-view-modal";
import { SearchIcon } from "./search-icon";

type ItemRow = {
  id: string;
  serial: number;
  name: string;
  category: string;
  base: string;
  commodity: Commodity;
};

const SEARCH_DEBOUNCE_MS = 300;
const ITEMS_PAGE_SIZE = 7;

function deriveBaseUnit(units: CommodityUnit[]): CommodityUnit | null {
  if (!units.length) {
    return null;
  }

  const explicitBaseUnit =
    units.find((unit) => unit.isBaseUnit) ??
    units.find((unit) => unit.baseUnitId === null) ??
    units.find((unit) => Number(unit.conversionFactor) === 1);

  if (explicitBaseUnit) {
    return explicitBaseUnit;
  }

  const referencedUnitIds = new Set(
    units
      .map((unit) => unit.baseUnitId)
      .filter((baseUnitId): baseUnitId is string => Boolean(baseUnitId)),
  );

  const referencedBaseUnit = units.find((unit) => referencedUnitIds.has(unit.id));
  return referencedBaseUnit ?? units[0];
}

function toConversionRows(
  units: CommodityUnit[],
  baseUnit: CommodityUnit | null,
) {
  const filteredUnits = baseUnit
    ? units.filter((unit) => unit.id !== baseUnit.id)
    : units;

  return filteredUnits.map((unit) => {
    const conversionFactor = Number(unit.conversionFactor);
    return {
      quantity:
        Number.isFinite(conversionFactor) && conversionFactor > 0
          ? String(conversionFactor)
          : "1",
      unitName: unit.name,
    };
  });
}

function normalizeQuantityLabel(quantity: string): string {
  const parsedQuantity = Number(quantity);
  if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
    return "1";
  }

  if (Number.isInteger(parsedQuantity)) {
    return String(parsedQuantity);
  }

  return String(Number(parsedQuantity.toFixed(4)));
}

function formatUnitName(unitName: string, quantity: string): string {
  const normalizedUnitName = unitName.trim().toLowerCase();
  if (!normalizedUnitName) {
    return "unit";
  }

  const parsedQuantity = Number(quantity);
  if (parsedQuantity === 1 || normalizedUnitName.endsWith("s")) {
    return normalizedUnitName;
  }

  return `${normalizedUnitName}s`;
}

function formatConversionValue(quantity: string, baseUnitName: string): string {
  const normalizedQuantity = normalizeQuantityLabel(quantity);
  return `${normalizedQuantity} ${formatUnitName(baseUnitName, normalizedQuantity)}`;
}

type ItemsPanelProps = {
  className?: string;
};

export function ItemsPanel({ className }: ItemsPanelProps) {
  const { showError, showSuccess } = useSnackbar();
  const router = useRouter();
  const { resetItemFlow, startUpdateItemFlow } = useItemFlowStore();
  const [itemSearch, setItemSearch] = useState("");
  const [debouncedItemSearch, setDebouncedItemSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToView, setItemToView] = useState<ItemRow | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ItemRow | null>(null);
  const deleteCommodityMutation = useDeleteCommodityMutation();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedItemSearch(itemSearch);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [itemSearch]);

  const commoditiesQuery = useCommoditiesQuery({
    page: currentPage,
    perPage: ITEMS_PAGE_SIZE,
    searchQuery: debouncedItemSearch,
  });

  const commodityPageData = commoditiesQuery.data?.data;
  const commodities = useMemo(
    () => commodityPageData?.data ?? [],
    [commodityPageData?.data],
  );
  const totalPages = Math.max(1, commodityPageData?.totalPages ?? 1);
  const activePage = Math.max(1, Math.min(currentPage, totalPages));

  const itemRows = useMemo<ItemRow[]>(
    () =>
      commodities.map((commodity, index) => ({
        id: commodity.id,
        serial: (activePage - 1) * ITEMS_PAGE_SIZE + index + 1,
        name: commodity.name,
        category: commodity.category?.name ?? "Uncategorized",
        base: deriveBaseUnit(commodity.units)?.name ?? "-",
        commodity,
      })),
    [commodities, activePage],
  );

  const itemsErrorMessage = commoditiesQuery.isError
    ? getApiErrorMessage(commoditiesQuery.error, "Unable to fetch items.")
    : null;

  const handleStartCreateItemFlow = useCallback(() => {
    resetItemFlow();
    router.push("/items/details");
  }, [resetItemFlow, router]);

  const handleStartUpdateItemFlow = useCallback((itemRow: ItemRow) => {
    const baseUnit = deriveBaseUnit(itemRow.commodity.units);
    const conversionRows = toConversionRows(itemRow.commodity.units, baseUnit);

    startUpdateItemFlow({
      commodityId: itemRow.commodity.id,
      details: {
        itemName: itemRow.commodity.name,
        description: itemRow.commodity.description ?? "",
        categoryId: itemRow.commodity.categoryId ?? "",
        baseUnitId: baseUnit?.name ?? "",
      },
      conversions: conversionRows,
    });

    router.push(`/items/${itemRow.commodity.id}/details`);
  }, [router, startUpdateItemFlow]);

  const handleOpenDeleteItemModal = useCallback((itemRow: ItemRow) => {
    setItemToDelete(itemRow);
  }, []);

  const handleOpenViewItemModal = useCallback((itemRow: ItemRow) => {
    setItemToView(itemRow);
  }, []);

  const handleCloseViewItemModal = useCallback(() => {
    setItemToView(null);
  }, []);

  const handleEditFromViewItemModal = useCallback(() => {
    if (!itemToView) {
      return;
    }

    setItemToView(null);
    handleStartUpdateItemFlow(itemToView);
  }, [handleStartUpdateItemFlow, itemToView]);

  const handleCloseDeleteItemModal = useCallback(() => {
    if (deleteCommodityMutation.isPending) {
      return;
    }
    setItemToDelete(null);
  }, [deleteCommodityMutation.isPending]);

  const handleConfirmDeleteItem = useCallback(async () => {
    if (!itemToDelete) {
      return;
    }

    try {
      const response = await deleteCommodityMutation.mutateAsync(
        itemToDelete.commodity.id,
      );
      showSuccess(response.message || "Item deleted successfully.");
      setItemToDelete(null);
    } catch (error) {
      showError(getApiErrorMessage(error, "Unable to delete item."), {
        title: "Deletion Failed",
      });
    }
  }, [deleteCommodityMutation, itemToDelete, showError, showSuccess]);

  const itemColumns = useMemo<DataTableColumn<ItemRow>[]>(
    () => [
      {
        id: "serial",
        header: "S/N",
        accessorKey: "serial",
        headerClassName: "w-[72px]",
        cellClassName: "text-[#667085]",
      },
      {
        id: "name",
        header: "Name",
        cell: (row) => (
          <div className="flex items-center gap-2.5">
            <NameInitialBadge name={row.name} />
            <span className="font-medium text-[#344054]">{row.name}</span>
          </div>
        ),
        cellClassName: "min-w-[160px]",
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        cellClassName: "text-[#475467]",
      },
      {
        id: "base",
        header: "Base",
        accessorKey: "base",
        cellClassName: "text-[#475467]",
      },
      {
        id: "actions",
        header: "Action",
        align: "center",
        cell: (row) => (
          <div className="flex items-center justify-center gap-2 text-[#98A2B3]">
            <IconButton
              label={`View ${row.name}`}
              onClick={() => handleOpenViewItemModal(row)}
              className="inline-flex items-center justify-center rounded-sm text-[#98A2B3] transition-colors hover:text-[#667085]"
            >
              <ViewIcon className="h-4 w-4" />
            </IconButton>
            <IconButton
              label={`Edit ${row.name}`}
              onClick={() => handleStartUpdateItemFlow(row)}
              className="inline-flex items-center justify-center rounded-sm transition-opacity hover:opacity-80"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              label={`Delete ${row.name}`}
              onClick={() => handleOpenDeleteItemModal(row)}
              className="inline-flex items-center justify-center rounded-sm transition-opacity hover:opacity-80"
            >
              <DeleteIcon className="h-4 w-4" />
            </IconButton>
          </div>
        ),
        cellClassName: "w-[130px]",
      },
    ],
    [handleOpenDeleteItemModal, handleOpenViewItemModal, handleStartUpdateItemFlow],
  );

  const viewedItemBaseUnit = useMemo(() => {
    if (!itemToView) {
      return "-";
    }

    return deriveBaseUnit(itemToView.commodity.units)?.name ?? "-";
  }, [itemToView]);

  const viewedItemConversions = useMemo(() => {
    if (!itemToView) {
      return [];
    }

    const baseUnit = deriveBaseUnit(itemToView.commodity.units);
    const baseUnitName = baseUnit?.name ?? itemToView.base ?? "unit";
    return toConversionRows(itemToView.commodity.units, baseUnit).map((row) => ({
      unitName: row.unitName,
      value: formatConversionValue(row.quantity, baseUnitName),
    }));
  }, [itemToView]);

  const emptyStateMessage = itemsErrorMessage
    ? itemsErrorMessage
    : commoditiesQuery.isPending
      ? "Loading items..."
      : "No items match your search.";

  return (
    <Card
      className={cn("rounded-[8px] border border-[#E4E7EC] p-4", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-full max-w-[330px]">
          <p className="text-[10px] font-bold uppercase text-[#98A2B3]">Items</p>
          <Input
            value={itemSearch}
            onChange={(event) => {
              setCurrentPage(1);
              setItemSearch(event.target.value);
            }}
            placeholder="search..."
            suffix={<SearchIcon className="h-4 w-4" />}
            className="mt-2 h-9 rounded-[6px] border-[#D0D5DD]"
            aria-label="Search items"
          />
        </div>

        <Button
          type="button"
          onClick={handleStartCreateItemFlow}
          className="h-10 min-w-[104px] rounded-[8px]"
        >
          Add Item
        </Button>
      </div>

      <div className="mt-5 overflow-hidden rounded-[8px] border border-[#E4E7EC]">
        <DataTable
          columns={itemColumns}
          rows={itemsErrorMessage ? [] : itemRows}
          rowKey="id"
          pagination={{
            mode: "server",
            currentPage: activePage,
            totalPages,
            onPageChange: setCurrentPage,
            isLoading: commoditiesQuery.isFetching,
          }}
          tableClassName="text-xs"
          emptyState={emptyStateMessage}
        />
      </div>

      {commoditiesQuery.isFetching && !commoditiesQuery.isPending ? (
        <p className="mt-2 text-[11px] text-[#98A2B3]">Updating items...</p>
      ) : null}

      <DeleteConfirmationModal
        open={Boolean(itemToDelete)}
        onClose={handleCloseDeleteItemModal}
        onConfirm={handleConfirmDeleteItem}
        isSubmitting={deleteCommodityMutation.isPending}
        itemName={itemToDelete?.name ?? "this item"}
      />

      <ItemViewModal
        open={Boolean(itemToView)}
        onClose={handleCloseViewItemModal}
        onEdit={handleEditFromViewItemModal}
        itemName={itemToView?.name ?? "-"}
        categoryName={itemToView?.category ?? "-"}
        baseUnitName={viewedItemBaseUnit}
        conversions={viewedItemConversions}
      />
    </Card>
  );
}
