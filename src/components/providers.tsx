"use client"

import { authClient } from "@/lib/auth/client"
import { NeonAuthUIProvider } from "@neondatabase/auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export const Providers = ({children}: {children: React.ReactNode}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <NeonAuthUIProvider authClient={authClient} emailOTP>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </NeonAuthUIProvider>
  )
}
