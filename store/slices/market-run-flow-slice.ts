import type { StateCreator } from "zustand";
import type { AppStore } from "../types";

export const DEFAULT_MARKET_RUN_MAX_QTY = 100000;

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
  pricePerUnit: number;
  minQty: number;
  maxQty: number;
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
    pricePerUnit: draft.pricePerUnit,
    minQty: draft.minQty,
    maxQty: draft.maxQty,
  }));
}

export type MarketRunFlowSlice = {
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
  resetMarketRunFlow: () => void;
};

export const createMarketRunFlowSlice: StateCreator<
  AppStore,
  [],
  [],
  MarketRunFlowSlice
> = (set) => ({
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
  resetMarketRunFlow: () =>
    set({
      marketRunDetailsDraft: initialMarketRunDetailsDraft,
      marketRunCommodityDrafts: [],
    }),
});
