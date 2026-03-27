"use client";

import { DeleteIcon } from "@/components/icons/delete";
import ItemHeader from "@/components/item/item-add-item-header";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { FormikInput } from "@/components/ui/input";
import {
  useCreateCommodityMutation,
  useUpdateCommodityMutation,
  type CommodityUnitPayload,
} from "@/lib/api/commodities";
import { getApiErrorMessage } from "@/lib/api/error";
import { useItemFlowStore } from "@/store";
import { useSnackbar } from "@/store/hooks/use-snackbar";
import { FieldArray, Form, Formik, type FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import * as yup from "yup";

type ConversionRow = {
  quantity: string;
  unitName: string;
  isBaseUnit?: boolean;
};

type ItemConversionFormValues = {
  conversions: ConversionRow[];
};

const validationSchema = yup.object({
  conversions: yup
    .array()
    .of(
      yup.object({
        quantity: yup
          .string()
          .required("Quantity is required")
          .test("positive-int", "Use a valid quantity", (value) => {
            if (!value) {
              return false;
            }
            const numberValue = Number(value);
            return Number.isInteger(numberValue) && numberValue > 0;
          }),
        unitName: yup.string().trim().required("Unit name is required"),
      }),
    )
    .min(1),
});

function createEmptyRow(quantity = "1"): ConversionRow {
  return { quantity, unitName: "", isBaseUnit: false };
}

function createBaseUnitRow(baseUnitId: string): ConversionRow {
  return {
    quantity: "1",
    unitName: baseUnitId.trim(),
    isBaseUnit: true,
  };
}

function getConversionHint(row: ConversionRow, baseUnitId: string): string {
  if (row.isBaseUnit) {
    return "Base unit is fixed at 1.";
  }
  const unitName = row.unitName.trim() || "unit";
  const quantityValue = Number(row.quantity);
  const quantity =
    Number.isInteger(quantityValue) && quantityValue > 0 ? quantityValue : 1;
  const normalizedBaseUnitName = baseUnitId.trim() || "base unit";
  return `means 1 ${unitName} = ${quantity} ${normalizedBaseUnitName.toLowerCase()}`;
}

function buildCommodityUnits(
  conversions: ConversionRow[],
  baseUnitId: string,
): CommodityUnitPayload[] {
  const normalizedBaseUnitName = baseUnitId.trim();
  const normalizedConversions = conversions
    .filter((row) => !row.isBaseUnit)
    .map((row) => ({
      unitName: row.unitName.trim(),
      quantity: Number(row.quantity),
    }))
    .filter(
      (row) => row.unitName.length > 0 && Number.isFinite(row.quantity) && row.quantity > 0,
    );

  return [
    {
      name: normalizedBaseUnitName,
      type: "SCIENTIFIC",
      conversionFactor: 1,
      isBaseUnit: true,
    },
    ...normalizedConversions.map((row) => ({
      name: row.unitName,
      type: "SCIENTIFIC" as const,
      conversionFactor: row.quantity,
      isBaseUnit: false,
    })),
  ];
}

export default function ItemConversionsPage() {
  const router = useRouter();
  const { showSuccess, showError } = useSnackbar();
  const createCommodityMutation = useCreateCommodityMutation();
  const updateCommodityMutation = useUpdateCommodityMutation();
  const {
    itemFlowMode,
    editingCommodityId,
    itemDetailsDraft,
    itemConversionsDraft,
    setItemConversionsDraft,
    resetItemFlow,
  } = useItemFlowStore();

  const isMutationPending =
    createCommodityMutation.isPending || updateCommodityMutation.isPending;

  const initialValues = useMemo<ItemConversionFormValues>(
    () => ({
      conversions: [
        createBaseUnitRow(itemDetailsDraft.baseUnitId),
        ...itemConversionsDraft.map((row) => ({
          quantity: row.quantity,
          unitName: row.unitName,
          isBaseUnit: false,
        })),
      ],
    }),
    [itemConversionsDraft, itemDetailsDraft.baseUnitId],
  );

  useEffect(() => {
    if (
      itemDetailsDraft.itemName.trim() &&
      itemDetailsDraft.categoryId.trim() &&
      itemDetailsDraft.baseUnitId.trim()
    ) {
      return;
    }

    const fallbackDetailsRoute =
      itemFlowMode === "update" && editingCommodityId
        ? `/items/${editingCommodityId}/details`
        : "/items/details";
    router.replace(fallbackDetailsRoute);
  }, [
    editingCommodityId,
    itemDetailsDraft.baseUnitId,
    itemDetailsDraft.categoryId,
    itemDetailsDraft.itemName,
    itemFlowMode,
    router,
  ]);

  async function handleSubmit(
    values: ItemConversionFormValues,
    { setSubmitting }: FormikHelpers<ItemConversionFormValues>,
  ) {
    try {
      const conversionDraftRows = values.conversions
        .filter((row) => !row.isBaseUnit)
        .map((row) => ({
          quantity: row.quantity,
          unitName: row.unitName,
        }));
      setItemConversionsDraft(conversionDraftRows);

      const normalizedItemName = itemDetailsDraft.itemName.trim();
      const normalizedDescription =
        itemDetailsDraft.description.trim() || normalizedItemName;
      const normalizedCategoryId = itemDetailsDraft.categoryId.trim();
      const normalizedBaseUnitId = itemDetailsDraft.baseUnitId.trim();

      const payload = {
        name: normalizedItemName,
        description: normalizedDescription,
        categoryId: normalizedCategoryId,
        commodityUnits: buildCommodityUnits(
          values.conversions,
          normalizedBaseUnitId,
        ),
      };

      if (itemFlowMode === "update" && editingCommodityId) {
        const response = await updateCommodityMutation.mutateAsync({
          id: editingCommodityId,
          ...payload,
        });

        showSuccess(response.message || "Item updated successfully.");
      } else {
        const response = await createCommodityMutation.mutateAsync(payload);
        showSuccess(response.message || "Item created successfully.");
      }

      resetItemFlow();
      router.push("/items");
    } catch (error) {
      showError(
        getApiErrorMessage(error, "Unable to save item."),
        {
          title: itemFlowMode === "update" ? "Update Failed" : "Creation Failed",
        },
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-[620px]">
      <ItemHeader />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          isSubmitting,
          isValid,
          setFieldTouched,
          setFieldValue,
        }) => (
          <Form className="mt-[40px]">
            <FieldArray name="conversions">
              {({ push, remove }) => (
                <>
                  <div className="space-y-4">
                    {values.conversions.map((row, index) => (
                      <div
                        key={`conversion-row-${index}`}
                        className="grid grid-cols-[160px_auto_1fr_auto] items-start gap-3"
                      >
                        <FormikInput
                          name={`conversions.${index}.quantity`}
                          helperText={getConversionHint(
                            row,
                            itemDetailsDraft.baseUnitId,
                          )}
                          disabled={row.isBaseUnit}
                        />

                        <span className="pt-3 text-base font-semibold text-[#1F2933]">
                          *
                        </span>

                        <FormikInput
                          name={`conversions.${index}.unitName`}
                          placeholder="eg. Derica"
                          disabled={row.isBaseUnit}
                        />

                        {row.isBaseUnit ? (
                          <span className="mt-3 inline-flex h-9 w-9" aria-hidden />
                        ) : (
                          <IconButton
                            label={`Delete conversion row ${index + 1}`}
                            onClick={() => {
                              remove(index);
                            }}
                            className="mt-3 text-red-300 transition-colors hover:text-red-500"
                          >
                            <DeleteIcon className="h-4 w-4" />
                          </IconButton>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    color="blue"
                    onClick={() => {
                      const editableRows = values.conversions
                        .map((row, index) => ({ row, index }))
                        .filter(({ row }) => !row.isBaseUnit);

                      const lastEditableRow = editableRows[editableRows.length - 1];
                      if (!lastEditableRow) {
                        push(createEmptyRow());
                        return;
                      }

                      const lastIndex = lastEditableRow.index;
                      const lastRow = lastEditableRow.row;
                      const hasValidQuantity = Number(lastRow.quantity) > 0;
                      const hasUnitName = Boolean(lastRow.unitName.trim());

                      if (!hasValidQuantity || !hasUnitName) {
                        setFieldTouched(
                          `conversions.${lastIndex}.quantity`,
                          true,
                          true,
                        );
                        setFieldTouched(
                          `conversions.${lastIndex}.unitName`,
                          true,
                          true,
                        );
                        return;
                      }

                      push(createEmptyRow());
                    }}
                    className="mt-[28px]"
                  >
                    Add
                  </Button>
                </>
              )}
            </FieldArray>

            <div className="mt-24 border-t border-[#D0D5DD] pt-5">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  color="slate"
                  variant="outline"
                  onClick={() => {
                    const conversionDraftRows = values.conversions
                      .filter((row) => !row.isBaseUnit)
                      .map((row) => ({
                        quantity: row.quantity,
                        unitName: row.unitName,
                      }));
                    setItemConversionsDraft(conversionDraftRows);
                    const detailsRoute =
                      itemFlowMode === "update" && editingCommodityId
                        ? `/items/${editingCommodityId}/details`
                        : "/items/details";
                    router.push(detailsRoute);
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting || isMutationPending}
                  className="w-full"
                >
                  {isSubmitting || isMutationPending
                    ? "Saving..."
                    : itemFlowMode === "update"
                      ? "Update Item"
                      : "Save Item"}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
