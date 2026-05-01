"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMembers } from "./service";
import type { GetMembersPayload } from "./types";

const DEFAULT_MEMBERS_PAGE = 1;
const DEFAULT_MEMBERS_PAGE_SIZE = 7;

export const membersQueryKeys = {
  all: ["members"] as const,
  list: (payload: { page: number; pageSize: number }) =>
    [...membersQueryKeys.all, payload.page, payload.pageSize] as const,
};

type UseMembersQueryOptions = {
  enabled?: boolean;
};

export function useMembersQuery(
  payload: GetMembersPayload = {},
  options: UseMembersQueryOptions = {},
) {
  const page = payload.page ?? DEFAULT_MEMBERS_PAGE;
  const pageSize = payload.pageSize ?? DEFAULT_MEMBERS_PAGE_SIZE;

  return useQuery({
    queryKey: membersQueryKeys.list({ page, pageSize }),
    queryFn: () =>
      getMembers({
        page,
        pageSize,
      }),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
    retry: false,
  });
}
