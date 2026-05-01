"use client";

import { useQuery } from "@tanstack/react-query";
import { getMarketRun, getMarketRuns } from "./service";
import type { GetMarketRunsPayload } from "./types";

const DEFAULT_MARKET_RUN_PAGE = 1;
const DEFAULT_MARKET_RUNS_PER_PAGE = 6;

export const marketRunsQueryKeys = {
  all: ["market-runs"] as const,
  list: (payload: { page: number; perPage: number }) =>
    [...marketRunsQueryKeys.all, payload.page, payload.perPage] as const,
  detail: (marketRunId: string) =>
    [...marketRunsQueryKeys.all, "detail", marketRunId] as const,
};

type UseMarketRunsQueryOptions = {
  enabled?: boolean;
};

export function useMarketRunsQuery(
  payload: GetMarketRunsPayload = {},
  options: UseMarketRunsQueryOptions = {},
) {
  const page = payload.page ?? DEFAULT_MARKET_RUN_PAGE;
  const perPage = payload.perPage ?? DEFAULT_MARKET_RUNS_PER_PAGE;

  return useQuery({
    queryKey: marketRunsQueryKeys.list({ page, perPage }),
    queryFn: () =>
      getMarketRuns({
        page,
        perPage,
      }),
    enabled: options.enabled ?? true,
  });
}

export function useMarketRunQuery(
  marketRunId: string,
  options: UseMarketRunsQueryOptions = {},
) {
  const normalizedMarketRunId = marketRunId.trim();

  return useQuery({
    queryKey: marketRunsQueryKeys.detail(normalizedMarketRunId),
    queryFn: () => getMarketRun(normalizedMarketRunId),
    enabled: (options.enabled ?? true) && Boolean(normalizedMarketRunId),
    retry: false,
  });
}
