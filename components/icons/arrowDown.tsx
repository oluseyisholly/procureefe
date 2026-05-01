import { cn } from "@/lib/utils";

type ProcureeLogoProps = {
  className?: string;
};

export function ArrowDownIcon({ className }: ProcureeLogoProps) {
  return (
    <svg
      width="6"
      height="3"
      viewBox="0 0 6 3"
      className={cn("h-[4px] w-auto", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.37849 2.87103L5.84349 0.771027C5.94165 0.694066 5.99898 0.576257 5.99898 0.451527C5.99898 0.326797 5.94165 0.208989 5.84349 0.132027C5.6241 -0.0440073 5.31188 -0.0440073 5.09249 0.132027L2.99949 1.91703L0.906489 0.137027C0.687103 -0.0390072 0.374875 -0.0390072 0.155489 0.137027C0.057333 0.213989 0 0.331797 0 0.456527C0 0.581258 0.057333 0.699066 0.155489 0.776027L2.62049 2.87103C2.84216 3.04908 3.15782 3.04908 3.37949 2.87103H3.37849Z"
        fill="#585B68"
      />
    </svg>
  );
}
