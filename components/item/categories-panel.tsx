"use client";

import { DeleteIcon } from "@/components/icons/delete";
import { EditIcon } from "@/components/icons/edit";
import { CategoryForm } from "@/components/item/category/form";
import { Card } from "@/components/ui/card";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Modal, ModalBody } from "@/components/ui/modal";
import {
  useCategoriesQuery,
  useDeleteCategoryMutation,
  type Category,
} from "@/lib/api/categories";
import { getApiErrorMessage } from "@/lib/api/error";
import { cn } from "@/lib/utils";
import { useSnackbar } from "@/store/hooks/use-snackbar";
import { useEffect, useMemo, useState } from "react";
import { SearchIcon } from "./search-icon";

const DEFAULT_CATEGORY_PAGE = 1;
const DEFAULT_CATEGORIES_PER_PAGE = 50;
const SEARCH_DEBOUNCE_MS = 300;

type CategoriesPanelProps = {
  className?: string;
};

export function CategoriesPanel({ className }: CategoriesPanelProps) {
  const { showError, showSuccess } = useSnackbar();
  const [categorySearch, setCategorySearch] = useState("");
  const [debouncedCategorySearch, setDebouncedCategorySearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const handleCloseCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setFormMode("create");
    setEditingCategory(null);
  };

  const handleOpenCreateCategoryModal = () => {
    setFormMode("create");
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (category: Category) => {
    setFormMode("update");
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleOpenDeleteCategoryModal = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleCloseDeleteCategoryModal = () => {
    if (deleteCategoryMutation.isPending) {
      return;
    }
    setCategoryToDelete(null);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!categoryToDelete?.id) {
      return;
    }

    try {
      const response = await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      showSuccess(response.message || "Category deleted successfully.");

      if (selectedCategoryId === categoryToDelete.id) {
        setSelectedCategoryId(null);
      }
      setCategoryToDelete(null);
    } catch (error) {
      showError(getApiErrorMessage(error, "Unable to delete category."), {
        title: "Deletion Failed",
      });
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCategorySearch(categorySearch);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [categorySearch]);

  const categoriesQuery = useCategoriesQuery({
    page: DEFAULT_CATEGORY_PAGE,
    perPage: DEFAULT_CATEGORIES_PER_PAGE,
    searchQuery: debouncedCategorySearch,
  });

  const categories = useMemo(
    () => categoriesQuery.data?.data.data ?? [],
    [categoriesQuery.data?.data.data],
  );

  const activeCategoryId = useMemo(() => {
    if (!categories.length) {
      return null;
    }

    if (
      selectedCategoryId &&
      categories.some((category) => category.id === selectedCategoryId)
    ) {
      return selectedCategoryId;
    }

    return categories[0].id;
  }, [categories, selectedCategoryId]);

  const categoriesErrorMessage = categoriesQuery.isError
    ? getApiErrorMessage(categoriesQuery.error, "Unable to fetch categories.")
    : null;

  return (
    <Card
      className={cn(
        "h-fit rounded-[8px] border border-[#E4E7EC] p-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase text-[#98A2B3]">
          Categories
        </p>
        <button
          type="button"
          onClick={handleOpenCreateCategoryModal}
          className="text-[10px] font-bold uppercase tracking-wide text-[#2E7DAF] underline decoration-[#2E7DAF] decoration-[1.5px] underline-offset-2"
        >
          Add Category
        </button>
      </div>

      <Input
        value={categorySearch}
        onChange={(event) => setCategorySearch(event.target.value)}
        placeholder="search..."
        suffix={<SearchIcon className="h-4 w-4" />}
        className="mt-2 h-9 rounded-[6px] border-[#D0D5DD]"
        aria-label="Search categories"
      />

      <ul className="mt-3 space-y-1">
        {categoriesQuery.isPending ? (
          <li className="px-2 py-3 text-xs text-[#98A2B3]">
            Loading categories...
          </li>
        ) : categoriesErrorMessage ? (
          <li className="px-2 py-3 text-xs text-[#D92D20]">
            {categoriesErrorMessage}
          </li>
        ) : categories.length ? (
          categories.map((category, index) => (
            <li
              key={category.id}
              className={cn(
                "flex items-center justify-between rounded-[6px] px-2 py-2",
                activeCategoryId === category.id
                  ? "bg-[#EAECF0]"
                  : "hover:bg-[#F2F4F7]",
              )}
            >
              <button
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="w-4 text-xs font-medium text-[#667085]">
                  {index + 1}.
                </span>
                <span className="truncate text-xs font-medium text-[#475467]">
                  {category.name}
                </span>
              </button>

              <div className="flex items-center gap-1 text-[#98A2B3]">
                <IconButton
                  disabled={!category.groupId}
                  label={`Edit ${category.name}`}
                  onClick={() => handleOpenEditCategoryModal(category)}
                  className={`${category.groupId ? "cursor-pointer" : "cursor-not-allowed"} inline-flex items-center justify-center rounded-sm p-0.5 transition-opacity hover:opacity-80`}
                >
                  <EditIcon/>
                </IconButton>
                <IconButton
                  disabled={!category.groupId}
                  label={`Delete ${category.name}`}
                  onClick={() => handleOpenDeleteCategoryModal(category)}
                  className={`${category.groupId ? "cursor-pointer" : "cursor-not-allowed"} inline-flex items-center justify-center rounded-sm p-0.5 transition-opacity hover:opacity-80`}
                >
                  <DeleteIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </li>
          ))
        ) : (
          <li className="px-2 py-3 text-xs text-[#98A2B3]">
            No categories found.
          </li>
        )}
      </ul>

      {categoriesQuery.isFetching && !categoriesQuery.isPending ? (
        <p className="mt-2 px-2 text-[11px] text-[#98A2B3]">
          Updating categories...
        </p>
      ) : null}

      <Modal
        open={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        title={formMode === "update" ? "Edit Category" : "Add Category"}
        panelClassName="max-w-[560px]"
      >
        <ModalBody className="space-y-4">
          <CategoryForm
            mode={formMode}
            initialCategory={editingCategory}
            onClose={handleCloseCategoryModal}
          />
        </ModalBody>
      </Modal>

      <DeleteConfirmationModal
        open={Boolean(categoryToDelete)}
        onClose={handleCloseDeleteCategoryModal}
        onConfirm={handleConfirmDeleteCategory}
        isSubmitting={deleteCategoryMutation.isPending}
        itemName={categoryToDelete?.name ?? "this category"}
      />
    </Card>
  );
}
