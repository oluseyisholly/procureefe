"use client";

import { Input } from "@/components/ui/input";
import { useCommoditiesQuery, type Commodity } from "@/lib/api/commodities";
import { getApiErrorMessage } from "@/lib/api";
import { useField } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";

const SEARCH_DEBOUNCE_MS = 300;

type CommoditySearchInputProps = {
  itemIdName: string;
  itemNameName: string;
  label: string;
  onSelectCommodity?: (commodity: Commodity | null) => void;
};

export function CommoditySearchInput({
  itemIdName,
  itemNameName,
  label,
  onSelectCommodity,
}: CommoditySearchInputProps) {
  const [, itemIdMeta, itemIdHelpers] = useField<string>(itemIdName);
  const [itemNameField, , itemNameHelpers] = useField<string>(itemNameName);
  const [searchValue, setSearchValue] = useState(itemNameField.value ?? "");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(
    itemNameField.value ?? "",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearchValue(itemNameField.value ?? "");
  }, [itemNameField.value]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commoditiesQuery = useCommoditiesQuery({
    page: 1,
    perPage: 25,
    searchQuery: debouncedSearchValue,
  });

  const commodityOptions = useMemo(
    () => commoditiesQuery.data?.data?.data ?? [],
    [commoditiesQuery.data?.data?.data],
  );

  const showError = Boolean(itemIdMeta.touched && itemIdMeta.error);
  const queryErrorMessage = commoditiesQuery.isError
    ? getApiErrorMessage(commoditiesQuery.error, "Unable to fetch items.")
    : null;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchValue(value);
    itemNameHelpers.setValue(value);
    itemIdHelpers.setValue("");
    onSelectCommodity?.(null);
    setIsDropdownOpen(true);
  }

  function handleSelectCommodity(commodity: Commodity) {
    setSearchValue(commodity.name);
    itemNameHelpers.setValue(commodity.name);
    itemIdHelpers.setValue(commodity.id);
    itemNameHelpers.setTouched(true, true);
    itemIdHelpers.setTouched(true, true);
    onSelectCommodity?.(commodity);
    setIsDropdownOpen(false);
  }

  function handleBlur() {
    itemNameHelpers.setTouched(true, true);
    itemIdHelpers.setTouched(true, true);
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label
        htmlFor={itemNameName}
        className="text-sm font-medium text-slate-600"
      >
        {label}
      </label>

      <div className="relative">
        <Input
          id={itemNameName}
          name={itemNameName}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={handleBlur}
          placeholder="Search item by name"
          autoComplete="off"
          className="h-11 rounded-[6px] border-[#98A2B3] text-base text-[#1F2933]"
          aria-invalid={showError}
        />

        {isDropdownOpen ? (
          <div className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-[8px] border border-[#D0D5DD] bg-white shadow-lg">
            {commoditiesQuery.isFetching ? (
              <p className="px-3 py-2 text-sm text-[#98A2B3]">Searching...</p>
            ) : queryErrorMessage ? (
              <p className="px-3 py-2 text-sm text-red-600">{queryErrorMessage}</p>
            ) : commodityOptions.length ? (
              commodityOptions.map((commodity) => (
                <button
                  key={commodity.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelectCommodity(commodity);
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#344054] transition-colors hover:bg-[#F2F4F7]"
                >
                  <span className="font-medium">{commodity.name}</span>
                  <span className="text-xs text-[#98A2B3]">
                    {commodity.category?.name ?? "Uncategorized"}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-[#98A2B3]">
                No items found.
              </p>
            )}
          </div>
        ) : null}
      </div>

      {showError ? (
        <p className="text-[11px] text-red-600">{itemIdMeta.error}</p>
      ) : null}
    </div>
  );
}
