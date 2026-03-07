import Image from "next/image";
import { DeleteIcon } from "../icons/delete";
import { EditIcon } from "../icons/edit";
import { IconButton } from "../ui/icon-button";

export type ReviewItem = {
  id: string;
  name: string;
  baseUnit: string;
  basePrice: string;
  minimumOrder: string;
  maximumOrder: string;
  tone: "amber" | "sky" | "rose";
};

const thumbnailToneStyles: Record<ReviewItem["tone"], string> = {
  amber: "bg-amber-100 text-amber-800",
  sky: "bg-sky-100 text-sky-800",
  rose: "bg-rose-100 text-rose-800",
};

export default function ReviewItemRow({ item }: { item: ReviewItem }) {
  return (
    <div
      key={item.id}
      className="flex items-center justify-between gap-4 rounded-[8px] border border-[#E5E7EB] bg-[#FCFCFD] px-4 py-3"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* <div
          className={`inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] text-xs font-semibold ${thumbnailToneStyles[item.tone]}`}
        >
          {item.name.charAt(0)}
        </div> */}

        <Image src={"/rice.svg"} alt="On Boarding Image" width={50} height={50} />

        <div className="min-w-0 flex-1">
          <div className="mt-1 grid grid-cols-3 gap-4 flex items-center">
            <div>
              <p className="text-[14px] font-[500] text-[#1F2933]">
                {item.name}
              </p>

              <p className="text-[11px] font-[400] text-[#9CA3AF]">Unit</p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.baseUnit}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-[400] text-[#9CA3AF]">
                Price per Unit
              </p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.basePrice}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-[400] text-[#9CA3AF]">
                Minimum Order
              </p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.minimumOrder}
              </p>
            </div>
            {/* <div>
              <p className="text-[11px] font-[400] text-[#9CA3AF]">
                Maximum Order
              </p>
              <p className="mt-1 text-[14px] font-[400] text-[#475467]">
                {item.maximumOrder}
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* <div className="flex items-center gap-3">
        <IconButton
          label={`Edit ${item.name}`}
          className="text-[#667085] transition-colors hover:text-[#475467]"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          label={`Delete ${item.name}`}
          className="text-red-500 transition-colors hover:text-red-600"
        >
          <DeleteIcon className="h-4 w-4" />
        </IconButton>
      </div> */}
    </div>
  );
}
