import { ChatInbox } from "@/features/chat/ui/Inbox/ChatInbox"
import { getCurrentUserServer } from "@/features/user/api/getCurrentUser.server"
import type { PropsWithChildren } from "react"

export default function Layout({ children }: PropsWithChildren<unknown>) {
  getCurrentUserServer()

  return (
    <div className="flex w-full">
      <ChatInbox />
      {children}
    </div>
  )
}
