"use client";

import { useMutation } from "@tanstack/react-query";
import {
  createMarketRun,
  updateMarketRun,
  updatePublishMarketRun,
} from "./service";
import type {
  CreateMarketRunPayload,
  UpdateMarketRunPayload,
  UpdatePublishMarketRunPayload,
} from "./types";

export function useCreateMarketRunMutation() {
  return useMutation({
    mutationFn: (payload: CreateMarketRunPayload) => createMarketRun(payload),
  });
}

export function useUpdateMarketRunMutation() {
  return useMutation({
    mutationFn: (payload: UpdateMarketRunPayload) => updateMarketRun(payload),
  });
}

export function useUpdatePublishMarketRunMutation() {
  return useMutation({
    mutationFn: (payload: UpdatePublishMarketRunPayload) =>
      updatePublishMarketRun(payload),
  });
}
