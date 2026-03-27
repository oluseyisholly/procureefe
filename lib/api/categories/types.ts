export type GetCategoriesPayload = {
  page?: number;
  perPage?: number;
  searchQuery?: string;
};

export type CreateCategoryPayload = {
  name: string;
  description: string;
};

export type UpdateCategoryPayload = {
  id: string;
  name: string;
  description: string;
};

export type Category = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  createdby: string | null;
  updatedby: string | null;
  groupId: string | null;
  parentCategoryId: string | null;
  name: string;
  description: string | null;
  sortOrder: number;
};

type PaginatedCategoriesData = {
  data: Category[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type GetCategoriesResponse = {
  code: number;
  message: string;
  data: PaginatedCategoriesData;
};

type ApiSuccessResponse<TData> = {
  code: number;
  message: string;
  data: TData;
};

export type CreateCategoryResponse = ApiSuccessResponse<Category>;
export type UpdateCategoryResponse = ApiSuccessResponse<Category>;
export type DeleteCategoryResponse = ApiSuccessResponse<unknown>;
