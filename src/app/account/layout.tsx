"use client"
import Sidebar from "@/components/Sidebar/Sidebar"
import CurrentUserProvider from "@/context/CurrentUserContext"

export default function ChatLayot({children}: {children: React.ReactNode}) {
  return (
    <CurrentUserProvider>
      <main className="flex max-h-screen overflow-hidden">
        <Sidebar />
        {children}
      </main>
    </CurrentUserProvider>
  )
}
