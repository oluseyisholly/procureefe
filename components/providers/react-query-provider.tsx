"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-client";

type ReactQueryProviderProps = {
  children: ReactNode;
};

const showErrorToast = (error: unknown) => {
  toast.error(getApiErrorMessage(error));
};

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            onError: showErrorToast,
          },
          mutations: {
            onError: showErrorToast,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
