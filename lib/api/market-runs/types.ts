export type MarketRunCommodityPayload = {
  pricePerUnit: number;
  minQty: number;
  maxQty: number | null;
  commodityUnitId: string;
  commodityId: string;
};

export type CreateMarketRunPayload = {
  name: string;
  requestEndDate: string;
  marketRunDate: string;
  marketRunCommodities: MarketRunCommodityPayload[];
};

export type CreateMarketRunResponse = {
  code: number;
  message: string;
  data: unknown;
};
