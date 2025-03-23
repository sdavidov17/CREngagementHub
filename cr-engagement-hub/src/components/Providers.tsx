"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";
import FeatureToggleProvider from "./FeatureToggleProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <FeatureToggleProvider>{children}</FeatureToggleProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
