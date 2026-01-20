"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {useState} from "react"
import {ClerkProvider} from "@clerk/nextjs"

export const Providers = ({children}: {children: React.ReactNode}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ClerkProvider>
  )
}
