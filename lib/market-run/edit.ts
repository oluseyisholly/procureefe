import { getCommodities, type Commodity } from "@/lib/api/commodities";
import type { MarketRunDetail } from "@/lib/api/market-runs";
import { createMarketRunCommodityDraftId, deriveLeastUnitData } from "./item";

type EditFlowSeed = {
  details: {
    description: string;
    bookingEndDate: string;
    marketRunDate: string;
  };
  commodityDrafts: Array<{
    id: string;
    commodityId: string;
    commodityName: string;
    commodityUnitId: string;
    commodityUnitName: string;
    unitMultiplier?: number;
    isLeastUnit?: boolean;
    pricePerUnit: number;
    minQty: number;
    maxQty: number | null;
  }>;
};

function formatDateInputValue(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function parseNumberValue(
  value: string | number | null | undefined,
): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue =
    typeof value === "number" ? value : Number.parseFloat(value);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

async function findCommodityById(
  commodityId: string,
  commodityName: string,
): Promise<Commodity | null> {
  const searchAttempts = [commodityName.trim(), ""];

  for (const searchQuery of searchAttempts) {
    const response = await getCommodities({
      page: 1,
      perPage: 200,
      searchQuery,
    });
    const commodity =
      response.data.data.find((candidate) => candidate.id === commodityId) ?? null;

    if (commodity) {
      return commodity;
    }
  }

  return null;
}

export async function buildMarketRunEditFlowSeed(
  marketRun: MarketRunDetail,
): Promise<EditFlowSeed> {
  const commodityIds = Array.from(
    new Set(
      marketRun.marketRunCommodities.map((commodity) => commodity.commodityId),
    ),
  );

  const commodityDetailsEntries = await Promise.all(
    commodityIds.map(async (commodityId) => {
      const marketRunCommodity = marketRun.marketRunCommodities.find(
        (commodity) => commodity.commodityId === commodityId,
      );

      if (!marketRunCommodity) {
        return [commodityId, null] as const;
      }

      try {
        const commodity = await findCommodityById(
          commodityId,
          marketRunCommodity.commodity?.name ?? "",
        );

        return [commodityId, commodity] as const;
      } catch {
        return [commodityId, null] as const;
      }
    }),
  );

  const commodityDetailsById = new Map(commodityDetailsEntries);
  const fallbackLeastUnitByCommodityId = new Map<string, string>();

  for (const commodityId of commodityIds) {
    const commodityDrafts = marketRun.marketRunCommodities.filter(
      (commodity) => commodity.commodityId === commodityId,
    );
    const fallbackLeastUnit = [...commodityDrafts].sort((a, b) => {
      const priceA = parseNumberValue(a.pricePerUnit) ?? Number.POSITIVE_INFINITY;
      const priceB = parseNumberValue(b.pricePerUnit) ?? Number.POSITIVE_INFINITY;
      return priceA - priceB;
    })[0];

    if (fallbackLeastUnit) {
      fallbackLeastUnitByCommodityId.set(
        commodityId,
        fallbackLeastUnit.commodityUnitId,
      );
    }
  }

  return {
    details: {
      description: marketRun.name?.trim() ?? "",
      bookingEndDate: formatDateInputValue(marketRun.requestEndDate),
      marketRunDate: formatDateInputValue(marketRun.marketRunDate),
    },
    commodityDrafts: marketRun.marketRunCommodities.map((commodity) => {
      const commodityDetails = commodityDetailsById.get(commodity.commodityId) ?? null;
      const leastUnit = deriveLeastUnitData(commodityDetails);
      const matchingUnit = commodityDetails?.units.find(
        (unit) => unit.id === commodity.commodityUnitId,
      );
      const parsedPrice = parseNumberValue(commodity.pricePerUnit) ?? 0;
      const parsedMinQty = parseNumberValue(commodity.minQty) ?? 1;
      const parsedMaxQty = parseNumberValue(commodity.maxQty);

      return {
        id: createMarketRunCommodityDraftId(),
        commodityId: commodity.commodityId,
        commodityName:
          commodity.commodity?.name ?? commodityDetails?.name ?? "Unknown Commodity",
        commodityUnitId: commodity.commodityUnitId,
        commodityUnitName:
          commodity.commodityUnit?.name ?? matchingUnit?.name ?? "Unit",
        unitMultiplier: matchingUnit
          ? Number.parseFloat(matchingUnit.conversionFactor)
          : undefined,
        isLeastUnit: leastUnit
          ? leastUnit.id === commodity.commodityUnitId
          : fallbackLeastUnitByCommodityId.get(commodity.commodityId) ===
            commodity.commodityUnitId,
        pricePerUnit: parsedPrice,
        minQty: Math.max(1, parsedMinQty),
        maxQty:
          parsedMaxQty === null ? null : Math.max(parsedMinQty, parsedMaxQty),
      };
    }),
  };
}
