import type { SVGProps } from "react";

export function InActiveMemberIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.75 13.3333L17.9166 17.5M17.9166 13.3333L13.75 17.5M9.99996 12.9167H6.24996C5.08699 12.9167 4.5055 12.9167 4.03234 13.0602C2.96701 13.3834 2.13333 14.217 1.81016 15.2824C1.66663 15.7555 1.66663 16.337 1.66663 17.5M12.0833 6.25C12.0833 8.32107 10.4044 10 8.33329 10C6.26223 10 4.58329 8.32107 4.58329 6.25C4.58329 4.17893 6.26223 2.5 8.33329 2.5C10.4044 2.5 12.0833 4.17893 12.0833 6.25Z"
        stroke="#DC2626"
        strokeWidth="0.833333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
