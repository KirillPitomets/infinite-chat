"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {useState} from "react"
import {ClerkProvider} from "@clerk/nextjs"
import {RealtimeProvider} from "@upstash/realtime/client"
import CurrentUserProvider from "@/context/CurrentUserProvider"

export const Providers = ({children}: {children: React.ReactNode}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  )
}
