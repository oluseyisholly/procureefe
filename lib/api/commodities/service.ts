import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateCommodityPayload,
  CreateCommodityResponse,
  DeleteCommodityResponse,
  GetCommoditiesPayload,
  GetCommoditiesResponse,
  UpdateCommodityPayload,
  UpdateCommodityResponse,
} from "./types";

const DEFAULT_COMMODITY_PAGE = 1;
const DEFAULT_COMMODITIES_PER_PAGE = 7;

export async function getCommodities(
  payload: GetCommoditiesPayload = {},
): Promise<GetCommoditiesResponse> {
  const page = payload.page ?? DEFAULT_COMMODITY_PAGE;
  const perPage = payload.perPage ?? DEFAULT_COMMODITIES_PER_PAGE;
  const normalizedSearchQuery = payload.searchQuery?.trim();

  const response = await apiClient.get<GetCommoditiesResponse>(
    API_ENDPOINTS.commodities.index,
    {
      params: {
        page,
        per_page: perPage,
        ...(normalizedSearchQuery ? { searchQuery: normalizedSearchQuery } : {}),
      },
    },
  );

  return response.data;
}

export async function createCommodity(
  payload: CreateCommodityPayload,
): Promise<CreateCommodityResponse> {
  const response = await apiClient.post<CreateCommodityResponse>(
    API_ENDPOINTS.commodities.index,
    payload,
  );

  return response.data;
}

export async function updateCommodity(
  payload: UpdateCommodityPayload,
): Promise<UpdateCommodityResponse> {
  const { id, ...updatePayload } = payload;
  const response = await apiClient.patch<UpdateCommodityResponse>(
    `${API_ENDPOINTS.commodities.index}/${encodeURIComponent(id)}`,
    updatePayload,
  );

  return response.data;
}

export async function deleteCommodity(
  id: string,
): Promise<DeleteCommodityResponse> {
  const response = await apiClient.delete<DeleteCommodityResponse>(
    `${API_ENDPOINTS.commodities.index}/${encodeURIComponent(id)}`,
  );

  return response.data;
}
