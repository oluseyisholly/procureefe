import type { DashboardSlice } from "./slices/dashboard-slice";
import type { ItemFlowSlice } from "./slices/item-flow-slice";
import type { MarketRunFlowSlice } from "./slices/market-run-flow-slice";
import type { UiSlice } from "./slices/ui-slice";

export type AppStore = DashboardSlice & ItemFlowSlice & MarketRunFlowSlice & UiSlice;
