import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CreateMarketRunPayload, CreateMarketRunResponse } from "./types";

export async function createMarketRun(
  payload: CreateMarketRunPayload,
): Promise<CreateMarketRunResponse> {
  const response = await apiClient.post<CreateMarketRunResponse>(
    API_ENDPOINTS.marketRuns.create,
    payload,
  );

  return response.data;
}
