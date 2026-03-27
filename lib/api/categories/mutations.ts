"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commoditiesQueryKeys } from "../commodities/queries";
import { createCategory, deleteCategory, updateCategory } from "./service";
import { categoriesQueryKeys } from "./queries";
import type { CreateCategoryPayload, UpdateCategoryPayload } from "./types";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => createCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) => updateCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => deleteCategory(categoryId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all }),
        queryClient.invalidateQueries({ queryKey: commoditiesQueryKeys.all }),
      ]);
    },
  });
}
