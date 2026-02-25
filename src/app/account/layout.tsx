"use client"
import Sidebar from "@/shared/components/ui/Sidebar/Sidebar"
import CurrentUserProvider from "@/shared/context/CurrentUserContext"
import { UserPresenceProvider } from "@/shared/context/UserPresenceContext"

export default function ChatLayot({ children }: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <UserPresenceProvider>
        <main className="flex max-h-screen overflow-hidden">
          <Sidebar />
          {children}
        </main>
      </UserPresenceProvider>
    </CurrentUserProvider>
  )
}
