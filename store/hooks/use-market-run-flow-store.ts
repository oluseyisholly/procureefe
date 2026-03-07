"use client";

import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../app-store";

export function useMarketRunFlowStore() {
  return useAppStore(
    useShallow((state) => ({
      marketRunDetailsDraft: state.marketRunDetailsDraft,
      marketRunCommodityDrafts: state.marketRunCommodityDrafts,
      setMarketRunDetailsDraft: state.setMarketRunDetailsDraft,
      addMarketRunCommodityDrafts: state.addMarketRunCommodityDrafts,
      replaceMarketRunCommodityDraftsForCommodity:
        state.replaceMarketRunCommodityDraftsForCommodity,
      removeMarketRunCommodityDraft: state.removeMarketRunCommodityDraft,
      removeMarketRunCommodityDraftsByCommodityId:
        state.removeMarketRunCommodityDraftsByCommodityId,
      clearMarketRunCommodityDrafts: state.clearMarketRunCommodityDrafts,
      resetMarketRunFlow: state.resetMarketRunFlow,
    })),
  );
}
