import type { PropsWithChildren } from "react"
import { ChatInbox } from "@/features/chat/ui/Inbox/ChatInbox"

export default function ChatLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="flex w-full">
      <ChatInbox />
      {children}
    </div>
  )
}
