"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query/build/modern";
import { WagmiProvider } from "wagmi";
import { config } from "@/config";
import { ReactNode } from "react";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
