import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateMarketRunPayload,
  CreateMarketRunResponse,
  GetMarketRunResponse,
  GetMarketRunsPayload,
  GetMarketRunsResponse,
  UpdateMarketRunPayload,
  UpdateMarketRunResponse,
  UpdatePublishMarketRunPayload,
  UpdatePublishMarketRunResponse,
} from "./types";

const DEFAULT_MARKET_RUN_PAGE = 1;
const DEFAULT_MARKET_RUNS_PER_PAGE = 6;

export async function getMarketRuns(
  payload: GetMarketRunsPayload = {},
): Promise<GetMarketRunsResponse> {
  const page = payload.page ?? DEFAULT_MARKET_RUN_PAGE;
  const perPage = payload.perPage ?? DEFAULT_MARKET_RUNS_PER_PAGE;

  const response = await apiClient.get<GetMarketRunsResponse>(
    API_ENDPOINTS.marketRuns.index,
    {
      params: {
        page,
        per_page: perPage,
      },
    },
  );

  return response.data;
}

export async function getMarketRun(
  marketRunId: string,
): Promise<GetMarketRunResponse> {
  const response = await apiClient.get<GetMarketRunResponse>(
    `${API_ENDPOINTS.marketRuns.index}/${encodeURIComponent(marketRunId)}`,
  );

  return response.data;
}

export async function createMarketRun(
  payload: CreateMarketRunPayload,
): Promise<CreateMarketRunResponse> {
  const response = await apiClient.post<CreateMarketRunResponse>(
    API_ENDPOINTS.marketRuns.create,
    payload,
  );

  return response.data;
}

export async function updateMarketRun(
  payload: UpdateMarketRunPayload,
): Promise<UpdateMarketRunResponse> {
  const { id, ...updatePayload } = payload;
  const response = await apiClient.patch<UpdateMarketRunResponse>(
    `${API_ENDPOINTS.marketRuns.index}/${encodeURIComponent(id)}`,
    updatePayload,
  );

  return response.data;
}

export async function updatePublishMarketRun(
  payload: UpdatePublishMarketRunPayload,
): Promise<UpdatePublishMarketRunResponse> {
  const { id, ...updatePayload } = payload;
  const response = await apiClient.patch<UpdatePublishMarketRunResponse>(
    `${API_ENDPOINTS.marketRuns.index}/${encodeURIComponent(id)}/update-publish`,
    updatePayload,
  );

  return response.data;
}
