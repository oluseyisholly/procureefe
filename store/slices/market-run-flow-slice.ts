import type { StateCreator } from "zustand";
import type { AppStore } from "../types";

export const DEFAULT_MARKET_RUN_MAX_QTY = 100000;

export type MarketRunFlowMode = "create" | "update";

export type MarketRunDetailsDraft = {
  description: string;
  bookingEndDate: string;
  marketRunDate: string;
};

export type MarketRunCommodityDraft = {
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
};

const initialMarketRunDetailsDraft: MarketRunDetailsDraft = {
  description: "",
  bookingEndDate: "",
  marketRunDate: "",
};

function cloneMarketRunCommodityDrafts(
  payload: MarketRunCommodityDraft[],
): MarketRunCommodityDraft[] {
  return payload.map((draft) => ({
    id: draft.id,
    commodityId: draft.commodityId,
    commodityName: draft.commodityName,
    commodityUnitId: draft.commodityUnitId,
    commodityUnitName: draft.commodityUnitName,
    unitMultiplier: draft.unitMultiplier,
    isLeastUnit: draft.isLeastUnit,
    pricePerUnit: draft.pricePerUnit,
    minQty: draft.minQty,
    maxQty: draft.maxQty,
  }));
}

export type MarketRunFlowSlice = {
  marketRunFlowMode: MarketRunFlowMode;
  editingMarketRunId: string | null;
  marketRunDetailsDraft: MarketRunDetailsDraft;
  marketRunCommodityDrafts: MarketRunCommodityDraft[];
  setMarketRunDetailsDraft: (payload: Partial<MarketRunDetailsDraft>) => void;
  addMarketRunCommodityDrafts: (payload: MarketRunCommodityDraft[]) => void;
  replaceMarketRunCommodityDraftsForCommodity: (
    commodityId: string,
    payload: MarketRunCommodityDraft[],
  ) => void;
  removeMarketRunCommodityDraft: (draftId: string) => void;
  removeMarketRunCommodityDraftsByCommodityId: (commodityId: string) => void;
  clearMarketRunCommodityDrafts: () => void;
  startUpdateMarketRunFlow: (payload: {
    marketRunId: string;
    details: Partial<MarketRunDetailsDraft>;
    commodityDrafts: MarketRunCommodityDraft[];
  }) => void;
  resetMarketRunFlow: () => void;
};

export const createMarketRunFlowSlice: StateCreator<
  AppStore,
  [],
  [],
  MarketRunFlowSlice
> = (set) => ({
  marketRunFlowMode: "create",
  editingMarketRunId: null,
  marketRunDetailsDraft: initialMarketRunDetailsDraft,
  marketRunCommodityDrafts: [],
  setMarketRunDetailsDraft: (payload) =>
    set((state) => ({
      marketRunDetailsDraft: {
        ...state.marketRunDetailsDraft,
        ...payload,
      },
    })),
  addMarketRunCommodityDrafts: (payload) =>
    set((state) => ({
      marketRunCommodityDrafts: [
        ...state.marketRunCommodityDrafts,
        ...cloneMarketRunCommodityDrafts(payload),
      ],
    })),
  replaceMarketRunCommodityDraftsForCommodity: (commodityId, payload) =>
    set((state) => ({
      marketRunCommodityDrafts: [
        ...state.marketRunCommodityDrafts.filter(
          (draft) => draft.commodityId !== commodityId,
        ),
        ...cloneMarketRunCommodityDrafts(payload),
      ],
    })),
  removeMarketRunCommodityDraft: (draftId) =>
    set((state) => ({
      marketRunCommodityDrafts: state.marketRunCommodityDrafts.filter(
        (draft) => draft.id !== draftId,
      ),
    })),
  removeMarketRunCommodityDraftsByCommodityId: (commodityId) =>
    set((state) => ({
      marketRunCommodityDrafts: state.marketRunCommodityDrafts.filter(
        (draft) => draft.commodityId !== commodityId,
      ),
    })),
  clearMarketRunCommodityDrafts: () => set({ marketRunCommodityDrafts: [] }),
  startUpdateMarketRunFlow: ({ marketRunId, details, commodityDrafts }) =>
    set({
      marketRunFlowMode: "update",
      editingMarketRunId: marketRunId,
      marketRunDetailsDraft: {
        ...initialMarketRunDetailsDraft,
        ...details,
      },
      marketRunCommodityDrafts: cloneMarketRunCommodityDrafts(commodityDrafts),
    }),
  resetMarketRunFlow: () =>
    set({
      marketRunFlowMode: "create",
      editingMarketRunId: null,
      marketRunDetailsDraft: initialMarketRunDetailsDraft,
      marketRunCommodityDrafts: [],
    }),
});
