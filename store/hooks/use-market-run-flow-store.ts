"use client";

import { useShallow } from "zustand/react/shallow";
import { useAppStore } from "../app-store";

export function useMarketRunFlowStore() {
  return useAppStore(
    useShallow((state) => ({
      marketRunFlowMode: state.marketRunFlowMode,
      editingMarketRunId: state.editingMarketRunId,
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
      startUpdateMarketRunFlow: state.startUpdateMarketRunFlow,
      resetMarketRunFlow: state.resetMarketRunFlow,
    })),
  );
}
