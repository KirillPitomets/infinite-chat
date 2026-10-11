import { getAllChatRooms } from "@/features/chat/chat/api/getAllChatRooms.server"
import { ChatInbox } from "@/features/chat/ui/Inbox/ChatInbox"
import type { PropsWithChildren } from "react"

export default async function Layout({ children }: PropsWithChildren<unknown>) {
  const rooms = await getAllChatRooms()

  return (
    <div className="flex w-full">
      <ChatInbox initialChatRooms={rooms} />
      {children}
    </div>
  )
}
