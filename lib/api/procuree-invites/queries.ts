"use client";

import { useQuery } from "@tanstack/react-query";
import { getProcureeInvitePreview } from "./service";
import type { GetProcureeInvitePreviewPayload } from "./types";

export const procureeInvitesQueryKeys = {
  all: ["procuree-invites"] as const,
  preview: (phone: string) =>
    [...procureeInvitesQueryKeys.all, "preview", phone] as const,
};

type UseProcureeInvitePreviewQueryOptions = {
  enabled?: boolean;
};

export function useProcureeInvitePreviewQuery(
  payload: GetProcureeInvitePreviewPayload,
  options: UseProcureeInvitePreviewQueryOptions = {},
) {
  const phone = payload.phone.trim();

  return useQuery({
    queryKey: procureeInvitesQueryKeys.preview(phone),
    queryFn: () =>
      getProcureeInvitePreview({
        phone,
      }),
    enabled: (options.enabled ?? true) && Boolean(phone),
    retry: false,
  });
}
