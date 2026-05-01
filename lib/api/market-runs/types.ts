export type MarketRunCommodityPayload = {
  pricePerUnit: number;
  minQty: number;
  maxQty: number | null;
  commodityUnitId: string;
  commodityId: string;
};

export type MarketRunCommodityRecord = {
  id: string;
  commodityId: string;
  commodityUnitId: string;
  pricePerUnit: string | number;
  status: string | null;
  displayLabel: string | null;
  isVisibleToProcurees: boolean;
  minQty: string | number;
  maxQty: string | number | null;
  commodity: {
    id: string;
    name: string;
  } | null;
  commodityUnit: {
    id: string;
    type: string;
    name: string;
  } | null;
};

export type MarketRunStatus =
  | "SAVED"
  | "OPEN"
  | "CLOSED"
  | "IN_PROGRESS"
  | "CANCELLED"
  | string;

export type MarketRun = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  createdby: string | null;
  updatedby: string | null;
  groupId: string | null;
  name: string | null;
  requestStartDate: string | null;
  requestEndDate: string | null;
  status: MarketRunStatus | null;
  marketRunDate: string | null;
  allocationsLocked: boolean;
};

export type MarketRunDetail = {
  id: string;
  created_at: string;
  updated_at: string;
  groupId: string | null;
  name: string | null;
  requestStartDate: string | null;
  requestEndDate: string | null;
  status: MarketRunStatus | null;
  marketRunDate: string | null;
  allocationsLocked: boolean;
  marketRunCommodities: MarketRunCommodityRecord[];
};

export type GetMarketRunsPayload = {
  page?: number;
  perPage?: number;
};

type PaginatedMarketRunsData = {
  data: MarketRun[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type ApiSuccessResponse<TData> = {
  code: number;
  message: string;
  data: TData;
};

export type GetMarketRunsResponse = ApiSuccessResponse<PaginatedMarketRunsData>;
export type GetMarketRunResponse = ApiSuccessResponse<MarketRunDetail>;

type MarketRunUpsertPayload = {
  name: string;
  requestEndDate: string;
  marketRunDate: string;
  marketRunCommodities: MarketRunCommodityPayload[];
};

export type CreateMarketRunPayload = MarketRunUpsertPayload;
export type UpdateMarketRunPayload = MarketRunUpsertPayload & {
  id: string;
};
export type UpdatePublishMarketRunPayload = MarketRunUpsertPayload & {
  id: string;
};

export type CreateMarketRunResponse = ApiSuccessResponse<unknown>;
export type UpdateMarketRunResponse = ApiSuccessResponse<unknown>;
export type UpdatePublishMarketRunResponse = ApiSuccessResponse<unknown>;
