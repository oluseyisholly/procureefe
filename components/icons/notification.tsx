import { cn } from "@/lib/utils";

type ProcureeLogoProps = {
  className?: string;
};

export function NotificationLogo({ className }: ProcureeLogoProps) {
  return (
    <svg
      width="30"
      height="30"
      className={cn("h-9 w-auto", className)}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 5H9.75C7.6498 5 6.5997 5 5.79754 5.40873C5.09193 5.76825 4.51825 6.34193 4.15873 7.04754C3.75 7.8497 3.75 8.8998 3.75 11V20.25C3.75 22.3502 3.75 23.4003 4.15873 24.2025C4.51825 24.9081 5.09193 25.4817 5.79754 25.8413C6.5997 26.25 7.6498 26.25 9.75 26.25H19C21.1002 26.25 22.1503 26.25 22.9525 25.8413C23.6581 25.4817 24.2317 24.9081 24.5913 24.2025C25 23.4003 25 22.3502 25 20.25V16.25M16.25 21.25H8.75M18.75 16.25H8.75"
        stroke="#1F2933"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.8483 10.1517C18.6494 8.95274 18.432 7.14399 19.1961 5.72391L24.0789 10.9025C22.6918 11.546 20.9924 11.2957 19.8483 10.1517Z"
        fill="#DC2626"
        stroke="#DC2626"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.079 10.9025L19.1963 5.72391C19.3655 5.40937 19.5829 5.1139 19.8485 4.84835C21.313 3.38388 23.6873 3.38388 25.1518 4.84835C26.6163 6.31282 26.6163 8.68718 25.1518 10.1517C24.8314 10.472 24.4674 10.7223 24.079 10.9025Z"
        fill="#DC2626"
        stroke="#DC2626"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
