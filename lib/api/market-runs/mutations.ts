"use client";

import { useMutation } from "@tanstack/react-query";
import { createMarketRun } from "./service";
import type { CreateMarketRunPayload } from "./types";

export function useCreateMarketRunMutation() {
  return useMutation({
    mutationFn: (payload: CreateMarketRunPayload) => createMarketRun(payload),
  });
}
