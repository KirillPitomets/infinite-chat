"use client"
import Sidebar from "@/shared/components/Sidebar/Sidebar"
import CurrentUserProvider from "@/shared/context/CurrentUserContext"
import { NotificationProvider } from "@/shared/context/NotificationContext"
import { UserPresenceProvider } from "@/shared/context/UserPresenceContext"

export default function ChatLayot({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <UserPresenceProvider>
        <NotificationProvider>
          <main className="flex max-h-screen overflow-hidden">
            <Sidebar />
            {children}
          </main>
        </NotificationProvider>
      </UserPresenceProvider>
    </CurrentUserProvider>
  )
}
