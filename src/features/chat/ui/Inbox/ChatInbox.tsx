"use client"

import { ChatInboxList } from "@/features/chat/ui/Inbox/InboxList/InboxList"
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput"
import { edenClient } from "@/shared/lib/eden"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../../chat/model/chat.keys"
import { useRealtimeInbox } from "../../realtime/useRealtimeInbox"

export function ChatInbox() {
  const {
    data: chats,
    isLoading,
    refetch
  } = useQuery<UserChatPreview[]>({
    queryKey: chatKeys.inbox(),
    queryFn: async () => {
      const res = await edenClient.chat.preview.get()

      return res.data ?? []
    },
    initialData: [],
    select: chats =>
      [...chats].sort(
        (a, b) =>
          new Date(b.latestMessage?.createdAt ?? 0).getTime() -
          new Date(a.latestMessage?.createdAt ?? 0).getTime()
      )
  })

  useRealtimeInbox(chats, () => refetch())

  return (
    <div className="basis-75 shrink-0 max-w-full py-7.5 h-screen flex flex-col border-r border-zinc-300">
      <div className="px-5 mb-5">
        <h2 className="mb-2 text-xl font-bold">Messages</h2>
        <SearchInput />
      </div>

      <div className="overflow-y-auto scroll-bar-thin">
        <ChatInboxList chats={chats} isLoadingSkeleton={isLoading} />
      </div>
    </div>
  )
}
