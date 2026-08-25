import { ChatInbox } from "@/features/chat/ui/Inbox/ChatInbox"
import type { PropsWithChildren } from "react"

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="flex w-full">
      <ChatInbox />
      {children}
    </div>
  )
}
