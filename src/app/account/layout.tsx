"use client"
import Sidebar from "@/shared/components/Sidebar/Sidebar"
import CurrentUserProvider from "@/shared/context/CurrentUserContext"
import { NotificationManager } from "@/shared/context/NotificationManager"
import { UserPresenceProvider } from "@/shared/context/UserPresenceContext"

export default function ChatLayot({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <UserPresenceProvider>
        <main className="flex max-h-screen overflow-hidden">
          <NotificationManager />
          <Sidebar />
          {children}
        </main>
      </UserPresenceProvider>
    </CurrentUserProvider>
  )
}
