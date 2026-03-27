export type CommodityUnitType = "SCIENTIFIC";

export type CommodityCategory = {
  id: string;
  name: string;
};

export type CommodityUnit = {
  id: string;
  name: string;
  conversionFactor: string;
  baseUnitId: string | null;
  isBaseUnit?: boolean;
};

export type Commodity = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  createdby: string | null;
  updatedby: string | null;
  groupId: string | null;
  name: string;
  description: string | null;
  isActive: boolean;
  categoryId: string | null;
  category: CommodityCategory | null;
  units: CommodityUnit[];
};

export type CommodityUnitPayload = {
  name: string;
  type: CommodityUnitType;
  conversionFactor: number;
  isBaseUnit: boolean;
};

export type CreateCommodityPayload = {
  name: string;
  description: string;
  categoryId: string;
  commodityUnits: CommodityUnitPayload[];
};

export type UpdateCommodityPayload = CreateCommodityPayload & {
  id: string;
};

export type GetCommoditiesPayload = {
  page?: number;
  perPage?: number;
  searchQuery?: string;
};

type PaginatedCommoditiesData = {
  data: Commodity[];
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

export type GetCommoditiesResponse = ApiSuccessResponse<PaginatedCommoditiesData>;

export type CreateCommodityResponse = ApiSuccessResponse<Commodity>;
export type UpdateCommodityResponse = ApiSuccessResponse<Commodity>;
export type DeleteCommodityResponse = ApiSuccessResponse<unknown>;
