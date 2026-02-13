"use client"
import Sidebar from "@/components/Sidebar/Sidebar"
import CurrentUserProvider, {
  useCurrentUser
} from "@/context/CurrentUserProvider"
import PresenceProvider from "@/context/PresenceProvider"

export default function ChatLayot({children}: {children: React.ReactNode}) {
  return (
    <CurrentUserProvider>
      <PresenceProvider>
        <main className="flex max-h-screen overflow-hidden">
          <Sidebar />
          {children}
        </main>
      </PresenceProvider>
    </CurrentUserProvider>
  )
}
