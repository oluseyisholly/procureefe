"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";

import { ReactQueryProvider } from "./react-query-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      {children}
      <Toaster richColors position="top-center" closeButton />
    </ReactQueryProvider>
  );
}
