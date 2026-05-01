"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { formatNaira } from "@/lib/market-run/item";

export type AutoCalculatedPriceRowViewModel = {
  unitId: string;
  label: string;
  autoCalculatedValue: number;
  isEnabled: boolean;
  inputValue: string;
  isPriceReadOnly?: boolean;
};

type AutoCalculatedPricesProps = {
  rows: AutoCalculatedPriceRowViewModel[];
  onToggleUnit: (unitId: string, checked: boolean) => void;
  onPriceChange: (unitId: string, value: string) => void;
  onPriceBlur: (unitId: string, value: string) => void;
};

export function AutoCalculatedPrices({
  rows,
  onToggleUnit,
  onPriceChange,
  onPriceBlur,
}: AutoCalculatedPricesProps) {
  return (
    <div className="rounded-[8px] bg-[#F8FAFC] p-4">
      <p className="text-sm font-semibold uppercase text-[#9CA3AF]">
        Auto-Calculated Prices
      </p>

      {rows.length ? (
        <div className="mt-3 space-y-2">
          {rows.map((priceRow) => (
            <div key={priceRow.unitId} className="flex items-center justify-between gap-4">
              <label
                className="flex items-center gap-2 text-sm text-[#334155]"
                htmlFor={`unit-toggle-${priceRow.unitId}`}
              >
                <Checkbox
                  id={`unit-toggle-${priceRow.unitId}`}
                  checked={priceRow.isEnabled}
                  onChange={(event) =>
                    onToggleUnit(priceRow.unitId, event.target.checked)
                  }
                  className="h-4 w-4 border-[#98A2B3] checked:border-[#067647] checked:bg-[#067647]"
                />
                {priceRow.label}
              </label>
              <div className="min-w-[160px]">
                <Input
                  type={priceRow.isEnabled ? "number" : "text"}
                  min={0}
                  step="0.01"
                  value={priceRow.isEnabled ? priceRow.inputValue : "----"}
                  disabled={!priceRow.isEnabled}
                  readOnly={priceRow.isPriceReadOnly}
                  onChange={(event) =>
                    onPriceChange(priceRow.unitId, event.target.value)
                  }
                  onBlur={(event) => onPriceBlur(priceRow.unitId, event.target.value)}
                  className={`h-[36px] rounded-[6px] border text-sm font-medium ${
                    priceRow.isEnabled
                      ? "border-[#98A2B3] bg-white text-[#475467]"
                      : "border-[#E4E7EC] bg-[#EAECF0] text-[#98A2B3]"
                  } ${priceRow.isPriceReadOnly ? "cursor-default" : ""}`}
                  aria-label={`${priceRow.label} price`}
                />
                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Auto: {formatNaira(priceRow.autoCalculatedValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-[#98A2B3]">
          Select an item with additional units to see auto-calculated prices.
        </p>
      )}
    </div>
  );
}
