import { apiClient } from "@/lib/api/axios";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CreateCategoryPayload,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  GetCategoriesPayload,
  GetCategoriesResponse,
  UpdateCategoryPayload,
  UpdateCategoryResponse,
} from "./types";

const DEFAULT_CATEGORY_PAGE = 1;
const DEFAULT_CATEGORIES_PER_PAGE = 50;

export async function getCategories(
  payload: GetCategoriesPayload = {},
): Promise<GetCategoriesResponse> {
  const page = payload.page ?? DEFAULT_CATEGORY_PAGE;
  const perPage = payload.perPage ?? DEFAULT_CATEGORIES_PER_PAGE;
  const normalizedSearchQuery = payload.searchQuery?.trim();

  const response = await apiClient.get<GetCategoriesResponse>(
    API_ENDPOINTS.categories.index,
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

export async function createCategory(
  payload: CreateCategoryPayload,
): Promise<CreateCategoryResponse> {
  const response = await apiClient.post<CreateCategoryResponse>(
    API_ENDPOINTS.categories.index,
    payload,
  );

  return response.data;
}

export async function updateCategory(
  payload: UpdateCategoryPayload,
): Promise<UpdateCategoryResponse> {
  const response = await apiClient.patch<UpdateCategoryResponse>(
    API_ENDPOINTS.categories.index,
    payload,
  );

  return response.data;
}

export async function deleteCategory(id: string): Promise<DeleteCategoryResponse> {
  const response = await apiClient.delete<DeleteCategoryResponse>(
    `${API_ENDPOINTS.categories.index}/${encodeURIComponent(id)}`,
  );

  return response.data;
}
