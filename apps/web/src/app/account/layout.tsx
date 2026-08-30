import { SocketProvider } from "@/features/chat/message/providers/socketProvider"
import { getCurrentUserServer } from "@/features/user/api/getCurrentUser.server"
import Sidebar from "@/shared/components/Sidebar/Sidebar"
import { NotificationManager } from "@/shared/context/NotificationManager"
import { UserPresenceProvider } from "@/shared/context/UserPresenceContext"
import { ApiError } from "@/shared/lib/api/unwrap"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from "@tanstack/react-query"
import { notFound } from "next/navigation"

export default async function AccountLayout({
  children
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserServer
  })

  try {
    await getCurrentUserServer()
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound()
    }
    throw err
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SocketProvider>
        <UserPresenceProvider>
          <main className="flex max-h-screen overflow-hidden">
            <NotificationManager />
            <Sidebar />
            {children}
          </main>
        </UserPresenceProvider>
      </SocketProvider>
    </HydrationBoundary>
  )
}
