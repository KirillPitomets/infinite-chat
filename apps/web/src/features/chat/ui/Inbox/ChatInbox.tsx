"use client"

import { ChatInboxList } from "@/features/chat/ui/Inbox/InboxList/InboxList"
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../../chat/model/chat.keys"
import { useMemo, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { ChatRoom } from "@/shared/types/api.type"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useInboxChats } from "../../chat/api/useInboxChats"
import {
  useChatRoomSocket,
  useMessagesSocket
} from "../../message/providers/socketProvider"
import { useRealtimeInbox } from "../../realtime/useRealtimeInbox"
import { useApiClient } from "@/shared/lib/api/useApiClient"

type ChatInboxProps = {
  initialChatRooms: ChatRoom[]
}

export function ChatInbox({ initialChatRooms }: ChatInboxProps) {
  const pathname = usePathname()
  const { chatId } = useParams()
  const [search, setSearch] = useState("")

  const { data: chats, isLoading } = useInboxChats(initialChatRooms)

  const messageSocket = useMessagesSocket()
  const chatRoomSocket = useChatRoomSocket()

  useRealtimeInbox(messageSocket, chatRoomSocket)

  // useRealtimeInbox(chats)

  const filteredChats = useMemo(() => {
    if (!chats) return []

    const query = search.toLowerCase().trim()
    if (!query) return chats

    return chats.filter(chat => {
      if (chat.type === "DIRECT") {
        return chat.memberships.map(member =>
          member.user.username.toLowerCase().includes(query)
        )

        // || chat.latestMessage?.content?.toLowerCase().includes(query)
      }

      if (chat.type === "GROUP") {
        return chat.name.toLowerCase().includes(query)

        // ||chat.latestMessage?.content?.toLowerCase().includes(query)
      }

      return false
    })
  }, [chats, search])

  return (
    <div
      className={`basis-75 shrink-0 max-w-full 
        ${
          pathname.includes(ACCOUNT_PAGES.CHAT) && chatId
            ? "block max-sm:hidden"
            : "block"
        } 
        max-sm:basis-full max-sm:w-full py-7.5 h-screen flex flex-col border-r border-zinc-300`}
    >
      <div className="px-5 mb-5">
        <h2 className="mb-2 text-xl font-bold">Messages</h2>
        <SearchInput value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="overflow-y-auto scroll-bar-thin">
        <ChatInboxList chats={chats} isLoadingSkeleton={isLoading} />
      </div>
    </div>
  )
}
