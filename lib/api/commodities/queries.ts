"use client";

import { useQuery } from "@tanstack/react-query";
import { getCommodities } from "./service";
import type { GetCommoditiesPayload } from "./types";

const DEFAULT_COMMODITY_PAGE = 1;
const DEFAULT_COMMODITIES_PER_PAGE = 7;

export const commoditiesQueryKeys = {
  all: ["commodities"] as const,
  list: (payload: { page: number; perPage: number; searchQuery: string }) =>
    [...commoditiesQueryKeys.all, payload.page, payload.perPage, payload.searchQuery] as const,
};

type UseCommoditiesQueryOptions = {
  enabled?: boolean;
};

export function useCommoditiesQuery(
  payload: GetCommoditiesPayload = {},
  options: UseCommoditiesQueryOptions = {},
) {
  const page = payload.page ?? DEFAULT_COMMODITY_PAGE;
  const perPage = payload.perPage ?? DEFAULT_COMMODITIES_PER_PAGE;
  const searchQuery = payload.searchQuery?.trim() ?? "";

  return useQuery({
    queryKey: commoditiesQueryKeys.list({ page, perPage, searchQuery }),
    queryFn: () =>
      getCommodities({
        page,
        perPage,
        searchQuery,
      }),
    enabled: options.enabled ?? true,
  });
}
