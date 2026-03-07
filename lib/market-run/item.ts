import type { Commodity, CommodityUnit } from "@/lib/api/commodities";
import type { MarketRunCommodityDraft } from "@/store/slices/market-run-flow-slice";

export type AutoCalculatedRow = {
  unitId: string;
  label: string;
  multiplier: number;
};

export type GroupedMarketItem = {
  commodityId: string;
  commodityName: string;
  displayPricePerUnit: number;
  displayUnitName: string;
  minimumOrder: number;
  unitCount: number;
  drafts: MarketRunCommodityDraft[];
};

export function formatNaira(value: number): string {
  return `\u20A6${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function createMarketRunCommodityDraftId(): string {
  return `market-run-unit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function deriveLeastUnitData(commodity: Commodity | null): CommodityUnit | null {
  if (!commodity?.units?.length) {
    return null;
  }

  const unitWithOne = commodity.units.find(
    (unit) => Number(unit.conversionFactor) === 1,
  );

  if (unitWithOne) {
    return unitWithOne;
  }

  const baseUnit =
    commodity.units.find((unit) => unit.isBaseUnit) ??
    commodity.units.find((unit) => unit.baseUnitId === null) ??
    commodity.units[0];

  return baseUnit ?? null;
}

export function deriveLeastUnit(commodity: Commodity | null): string {
  return deriveLeastUnitData(commodity)?.name ?? "unit";
}

export function deriveAutoCalculatedRows(commodity: Commodity | null): AutoCalculatedRow[] {
  if (!commodity?.units?.length) {
    return [];
  }

  const leastUnitName = deriveLeastUnit(commodity);

  return commodity.units
    .map((unit) => ({
      unitId: unit.id,
      label: unit.name,
      multiplier: Number(unit.conversionFactor),
    }))
    .filter(
      (unit) =>
        Number.isFinite(unit.multiplier) &&
        unit.multiplier > 0 &&
        unit.label !== leastUnitName,
    )
    .sort((a, b) => a.multiplier - b.multiplier);
}

export function groupMarketRunCommodityDrafts(
  drafts: MarketRunCommodityDraft[],
): GroupedMarketItem[] {
  const groupedItems = new Map<
    string,
    {
      commodityId: string;
      commodityName: string;
      displayPricePerUnit: number;
      displayUnitName: string;
      minimumOrder: number;
      unitIds: Set<string>;
      drafts: MarketRunCommodityDraft[];
    }
  >();

  for (const draft of drafts) {
    const current = groupedItems.get(draft.commodityId);
    if (!current) {
      groupedItems.set(draft.commodityId, {
        commodityId: draft.commodityId,
        commodityName: draft.commodityName,
        displayPricePerUnit: draft.pricePerUnit,
        displayUnitName: draft.commodityUnitName,
        minimumOrder: draft.minQty,
        unitIds: new Set([draft.commodityUnitId]),
        drafts: [draft],
      });
      continue;
    }

    current.unitIds.add(draft.commodityUnitId);
    current.drafts.push(draft);
  }

  return Array.from(groupedItems.values()).map((item) => ({
    commodityId: item.commodityId,
    commodityName: item.commodityName,
    displayPricePerUnit: item.displayPricePerUnit,
    displayUnitName: item.displayUnitName,
    minimumOrder: item.minimumOrder,
    unitCount: item.unitIds.size,
    drafts: item.drafts,
  }));
}
