import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createDashboardSlice } from "./slices/dashboard-slice";
import { createItemFlowSlice } from "./slices/item-flow-slice";
import { createMarketRunFlowSlice } from "./slices/market-run-flow-slice";
import { createOnboardingFlowSlice } from "./slices/onboarding-flow-slice";
import { createUiSlice } from "./slices/ui-slice";
import type { AppStore } from "./types";

const MARKET_RUN_FLOW_STORAGE_KEY = "procureefe_market_run_flow";

export const useAppStore = create<AppStore>()(
  persist(
    (...state) => ({
      ...createUiSlice(...state),
      ...createItemFlowSlice(...state),
      ...createMarketRunFlowSlice(...state),
      ...createOnboardingFlowSlice(...state),
      ...createDashboardSlice(...state),
    }),
    {
      name: MARKET_RUN_FLOW_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        marketRunDetailsDraft: state.marketRunDetailsDraft,
        marketRunCommodityDrafts: state.marketRunCommodityDrafts,
      }),
    },
  ),
);
