"use client";

import { AutoCalculatedPrices, type AutoCalculatedPriceRowViewModel } from "@/components/marketRun/item/auto-calculated-prices";
import { CommoditySearchInput } from "@/components/marketRun/item/commodity-search-input";
import { MarketItemsSidebar } from "@/components/marketRun/item/market-items-sidebar";
import { MarketRunHeader } from "@/components/marketRun/header-marketrun";
import { Button } from "@/components/ui/button";
import { FormikInput } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api";
import { getCommodities, type Commodity } from "@/lib/api/commodities";
import {
  createMarketRunCommodityDraftId,
  deriveAutoCalculatedRows,
  deriveLeastUnit,
  deriveLeastUnitData,
  groupMarketRunCommodityDrafts,
  resolveQuantityForUnit,
  type GroupedMarketItem,
} from "@/lib/market-run/item";
import { useMarketRunFlowStore } from "@/store";
import { Form, Formik, type FormikHelpers, type FormikProps } from "formik";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import * as yup from "yup";

type AddItemFormValues = {
  itemId: string;
  itemName: string;
  budgetPrice: string;
  minimumOrder: string;
  maximumOrder: string;
};

const initialValues: AddItemFormValues = {
  itemId: "",
  itemName: "",
  budgetPrice: "0",
  minimumOrder: "1",
  maximumOrder: "",
};

const addItemValidationSchema = yup.object({
  itemId: yup.string().trim().required("Select an item"),
  budgetPrice: yup
    .string()
    .trim()
    .required("Budget price is required")
    .test("valid-budget", "Enter a valid budget price", (value) => {
      if (!value) {
        return false;
      }
      return Number(value) > 0;
    }),
  minimumOrder: yup
    .string()
    .trim()
    .required("Minimum order is required")
    .test("valid-min-order", "Enter a valid minimum order", (value) => {
      if (!value) {
        return false;
      }
      const numberValue = Number(value);
      return Number.isInteger(numberValue) && numberValue > 0;
    }),
  maximumOrder: yup
    .string()
    .trim()
    .test("valid-max-order", "Enter a valid maximum order", (value) => {
      const trimmedValue = (value ?? "").trim();
      if (!trimmedValue) {
        return true;
      }
      const numberValue = Number(trimmedValue);
      return Number.isInteger(numberValue) && numberValue > 0;
    })
    .test(
      "max-greater-than-min",
      "Maximum order must be greater than or equal to minimum order",
      function (value) {
        const trimmedValue = (value ?? "").trim();
        if (!trimmedValue) {
          return true;
        }

        const minimumOrder = Number((this.parent as AddItemFormValues).minimumOrder);
        const maximumOrder = Number(trimmedValue);
        if (!Number.isFinite(minimumOrder) || !Number.isFinite(maximumOrder)) {
          return true;
        }

        return maximumOrder >= minimumOrder;
      },
    ),
});

export default function MarketRunItemsPage() {
  const router = useRouter();
  const formikRef = useRef<FormikProps<AddItemFormValues> | null>(null);
  const commodityByIdRef = useRef<Record<string, Commodity | undefined>>({});
  const {
    marketRunCommodityDrafts,
    replaceMarketRunCommodityDraftsForCommodity,
    removeMarketRunCommodityDraftsByCommodityId,
  } = useMarketRunFlowStore();

  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(
    null,
  );
  const [autoPriceOverrides, setAutoPriceOverrides] = useState<
    Record<string, string>
  >({});
  const [enabledUnitSelections, setEnabledUnitSelections] = useState<
    Record<string, boolean>
  >({});
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoringCommodityId, setRestoringCommodityId] = useState<string | null>(
    null,
  );

  const groupedMarketItems = useMemo<GroupedMarketItem[]>(
    () => groupMarketRunCommodityDrafts(marketRunCommodityDrafts),
    [marketRunCommodityDrafts],
  );

  function handleSelectCommodity(commodity: Commodity | null) {
    setRestoreError(null);
    setSelectedCommodity(commodity);
    setAutoPriceOverrides({});

    if (!commodity) {
      setEnabledUnitSelections({});
      return;
    }

    commodityByIdRef.current[commodity.id] = commodity;

    const initialSelections = deriveAutoCalculatedRows(commodity).reduce<
      Record<string, boolean>
    >((accumulator, row) => {
      accumulator[row.unitId] = true;
      return accumulator;
    }, {});
    setEnabledUnitSelections(initialSelections);
  }

  function handleAddItemSubmit(
    values: AddItemFormValues,
    { setSubmitting, resetForm }: FormikHelpers<AddItemFormValues>,
  ) {
    const leastUnit = deriveLeastUnitData(selectedCommodity);
    if (!selectedCommodity || !leastUnit) {
      setSubmitting(false);
      return;
    }

    const budgetPricePerBaseUnit = Number(values.budgetPrice);
    const minimumOrder = Number(values.minimumOrder);
    const hasMaximumOrderInput = values.maximumOrder.trim() !== "";
    const maximumOrderInLeastUnit = hasMaximumOrderInput
      ? Number(values.maximumOrder)
      : null;
    const selectableRows = deriveAutoCalculatedRows(selectedCommodity);
    const selectedRows = selectableRows.filter(
      (row) => enabledUnitSelections[row.unitId] ?? true,
    );

    if (selectedRows.length === 0) {
      setSubmitting(false);
      return;
    }

    const nextCommodityDrafts = selectedRows
      .map((row) => {
        const isBaseUnit = row.isBaseUnit || row.unitId === leastUnit.id;
        const resolvedMinimumOrder = resolveQuantityForUnit(
          minimumOrder,
          row.multiplier,
          "minimum",
        );
        const resolvedMaximumOrder =
          maximumOrderInLeastUnit === null
            ? null
            : resolveQuantityForUnit(
                maximumOrderInLeastUnit,
                row.multiplier,
                "maximum",
              );
        const overrideRaw = autoPriceOverrides[row.unitId];
        const parsedOverride =
          overrideRaw !== undefined && overrideRaw.trim() !== ""
            ? Number(overrideRaw)
            : NaN;
        const resolvedPrice = isBaseUnit
          ? budgetPricePerBaseUnit
          : Number.isFinite(parsedOverride)
            ? parsedOverride
            : budgetPricePerBaseUnit * row.multiplier;

        return {
          id: createMarketRunCommodityDraftId(),
          commodityId: selectedCommodity.id,
          commodityName: selectedCommodity.name,
          commodityUnitId: row.unitId,
          commodityUnitName: row.label,
          unitMultiplier: row.multiplier,
          isLeastUnit: isBaseUnit,
          pricePerUnit: resolvedPrice,
          minQty: resolvedMinimumOrder,
          maxQty:
            resolvedMaximumOrder === null
              ? null
              : Math.max(resolvedMaximumOrder, resolvedMinimumOrder),
        };
      });

    replaceMarketRunCommodityDraftsForCommodity(
      selectedCommodity.id,
      nextCommodityDrafts,
    );

    resetForm({ values: initialValues });
    handleSelectCommodity(null);
    setSubmitting(false);
  }

  async function handleViewMarketItem(item: GroupedMarketItem) {
    setRestoreError(null);
    setRestoringCommodityId(item.commodityId);

    try {
      let commodity = commodityByIdRef.current[item.commodityId];

      if (!commodity) {
        const commoditiesResponse = await getCommodities({
          page: 1,
          perPage: 100,
          searchQuery: item.commodityName,
        });
        commodity =
          commoditiesResponse.data.data.find(
            (candidate) => candidate.id === item.commodityId,
          ) ?? undefined;
      }

      if (!commodity) {
        throw new Error("Commodity details not found.");
      }

      commodityByIdRef.current[item.commodityId] = commodity;

      const leastUnit = deriveLeastUnitData(commodity);
      const leastUnitDraft = leastUnit
        ? item.drafts.find((draft) => draft.commodityUnitId === leastUnit.id)
        : undefined;
      const fallbackDraft = item.drafts[0];
      const baseDraft = leastUnitDraft ?? fallbackDraft;
      const autoRows = deriveAutoCalculatedRows(commodity);
      const rowByUnitId = new Map(
        autoRows.map((row) => [row.unitId, row] as const),
      );

      if (!baseDraft) {
        throw new Error("No draft data available for this commodity.");
      }

      const budgetPrice = leastUnitDraft
        ? leastUnitDraft.pricePerUnit
        : (() => {
            const fallbackMultiplier =
              rowByUnitId.get(baseDraft.commodityUnitId)?.multiplier ?? 1;
            return baseDraft.pricePerUnit / fallbackMultiplier;
          })();
      const minimumOrder = leastUnitDraft?.minQty ?? 1;
      const maximumOrder = leastUnitDraft
        ? leastUnitDraft.maxQty
        : (() => {
            if (baseDraft.maxQty === null) {
              return null;
            }
            const fallbackMultiplier =
              rowByUnitId.get(baseDraft.commodityUnitId)?.multiplier ?? 1;
            return Math.max(1, Math.floor(baseDraft.maxQty * fallbackMultiplier));
          })();
      const draftByUnitId = new Map(
        item.drafts.map((draft) => [draft.commodityUnitId, draft] as const),
      );
      const nextSelections: Record<string, boolean> = {};
      const nextOverrides: Record<string, string> = {};

      for (const row of autoRows) {
        const matchingDraft = draftByUnitId.get(row.unitId);
        const isSelected = Boolean(matchingDraft);
        nextSelections[row.unitId] = isSelected;

        if (!matchingDraft || row.isBaseUnit) {
          continue;
        }

        const autoPrice = budgetPrice * row.multiplier;
        if (Math.abs(matchingDraft.pricePerUnit - autoPrice) > 0.0001) {
          nextOverrides[row.unitId] = String(matchingDraft.pricePerUnit);
        }
      }

      removeMarketRunCommodityDraftsByCommodityId(item.commodityId);
      setSelectedCommodity(commodity);
      setEnabledUnitSelections(nextSelections);
      setAutoPriceOverrides(nextOverrides);
      formikRef.current?.setValues({
        itemId: commodity.id,
        itemName: commodity.name,
        budgetPrice: String(budgetPrice),
        minimumOrder: String(minimumOrder),
        maximumOrder: maximumOrder === null ? "" : String(maximumOrder),
      });
      formikRef.current?.setTouched({});
    } catch (error) {
      setRestoreError(
        getApiErrorMessage(error, "Unable to load this item into the form."),
      );
    } finally {
      setRestoringCommodityId(null);
    }
  }

  function handleAutoPriceChange(unitId: string, value: string) {
    setAutoPriceOverrides((current) => ({
      ...current,
      [unitId]: value,
    }));
  }

  function handleAutoPriceBlur(unitId: string, value: string) {
    if (value.trim() !== "") {
      return;
    }

    setAutoPriceOverrides((current) => {
      const next = { ...current };
      delete next[unitId];
      return next;
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1005px] rounded-[10px] bg-white p-8">
      <div className="grid grid-cols-[1.7fr_1fr] gap-8">
        <div className="pr-8">
          <MarketRunHeader
            title="Add Items"
            subtitle="Select Items you want to go to market for and enter details"
          />

          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={addItemValidationSchema}
            onSubmit={handleAddItemSubmit}
            validateOnMount
          >
            {({ values, isSubmitting }) => {
              const budgetPrice = Number(values.budgetPrice || 0);
              const leastUnitName = deriveLeastUnit(selectedCommodity);
              const autoCalculatedRows = deriveAutoCalculatedRows(selectedCommodity);
              const hasAtLeastOneSelected = autoCalculatedRows.some(
                (row) => enabledUnitSelections[row.unitId] ?? true,
              );
              const autoCalculatedPrices: AutoCalculatedPriceRowViewModel[] =
                autoCalculatedRows.map((row) => {
                  const autoCalculatedValue =
                    budgetPrice > 0 ? budgetPrice * row.multiplier : 0;
                  const overrideValue = autoPriceOverrides[row.unitId];
                  const isEnabled = enabledUnitSelections[row.unitId] ?? true;

                  return {
                    unitId: row.unitId,
                    label: row.label,
                    autoCalculatedValue,
                    isEnabled,
                    isPriceReadOnly: row.isBaseUnit,
                    inputValue:
                      row.isBaseUnit
                        ? values.budgetPrice
                        : overrideValue !== undefined
                        ? overrideValue
                        : autoCalculatedValue.toFixed(2),
                  };
                });

              return (
                <Form className="mt-6 space-y-4">
                  <CommoditySearchInput
                    itemIdName="itemId"
                    itemNameName="itemName"
                    label="Select Item"
                    onSelectCommodity={handleSelectCommodity}
                  />

                  <FormikInput
                    name="budgetPrice"
                    label="Budget price per unit"
                    type="number"
                    min={0}
                    step="0.01"
                    prefix="₦"
                    className="h-11 rounded-[6px] border-[#98A2B3]"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormikInput
                      name="minimumOrder"
                      label={`Minimum Order (${leastUnitName})`}
                      type="number"
                      min={1}
                      step={1}
                      className="h-11 rounded-[6px] border-[#98A2B3]"
                    />
                    <FormikInput
                      name="maximumOrder"
                      label={`Maximum Order (${leastUnitName})`}
                      helperText="Optional. Leave empty to send no maximum order."
                      placeholder="Optional"
                      type="number"
                      min={1}
                      step={1}
                      className="h-11 rounded-[6px] border-[#98A2B3]"
                    />
                  </div>
                  <p className="text-[11px] text-[#98A2B3]">
                    Minimum and maximum values are entered in {leastUnitName}. Higher
                    units are auto-resolved to whole numbers and never to zero.
                  </p>

                  <AutoCalculatedPrices
                    rows={autoCalculatedPrices}
                    onToggleUnit={(unitId, checked) =>
                      setEnabledUnitSelections((current) => ({
                        ...current,
                        [unitId]: checked,
                      }))
                    }
                    onPriceChange={handleAutoPriceChange}
                    onPriceBlur={handleAutoPriceBlur}
                  />
                  {autoCalculatedRows.length > 0 && !hasAtLeastOneSelected ? (
                    <p className="text-sm text-red-600">
                      Select at least one unit before adding this item.
                    </p>
                  ) : null}

                  <div className="flex items-center justify-between gap-3">
                    <Button
                      type="submit"
                      color="blue"
                      disabled={isSubmitting || !hasAtLeastOneSelected}
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>

        <MarketItemsSidebar
          items={groupedMarketItems}
          restoreError={restoreError}
          restoringCommodityId={restoringCommodityId}
          onView={(item) => void handleViewMarketItem(item)}
          onDelete={removeMarketRunCommodityDraftsByCommodityId}
        />
      </div>

      <div className="pt-6">
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-end gap-5">
            <Button
              type="button"
              color="slate"
              variant="outline"
              className="w-[200px]"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="slate"
              variant="primary"
              className="w-[200px] bg-[#6B7280] text-white hover:bg-[#5F6774]"
              onClick={() => router.push("/market-run/details")}
            >
              Back: Details
            </Button>
            <Button
              type="button"
              className="w-[200px]"
              onClick={() => router.push("/market-run/review")}
            >
              Next : Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
