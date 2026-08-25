"use client"
import Sidebar from "@/shared/components/Sidebar/Sidebar"
import { NotificationManager } from "@/shared/context/NotificationManager"
import { UserPresenceProvider } from "@/shared/context/UserPresenceContext"

export default function ChatLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <UserPresenceProvider>
      <main className="flex max-h-screen overflow-hidden">
        <NotificationManager />
        <Sidebar />
        {children}
      </main>
    </UserPresenceProvider>
  )
}
