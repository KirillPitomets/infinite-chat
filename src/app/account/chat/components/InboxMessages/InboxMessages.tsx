"use client"

import SearchInput from "@/components/ui/SearchInput/SearchInput"
import {useQuery} from "@tanstack/react-query"
import {edenClient} from "@/lib/eden"
import {InboxMessagesList} from "./List/InboxMessagesList"
import {UserChatPreviewDTO} from "@/shared/chatPreview.schema"
import {InboxMessagesListSkeleton} from "./List/InboxMessagesListSkeleton"

export function InboxMessages() {
  const {data: chats = [], isLoading} = useQuery<UserChatPreviewDTO[]>({
    queryKey: ["getUserChatsPreviewList"],
    queryFn: async () => {
      const res = await edenClient.chat.preview.get()

      return res.data ?? []
    }
  })

  return (
    <div className="py-7.5 h-screen flex flex-col border-r border-zinc-300">
      <div className="px-5 mb-5">
        <h2 className="mb-2 text-xl font-bold">Messages</h2>
        <SearchInput />
      </div>

      <div className="overflow-y-auto scroll-bar-thin">
        {isLoading ? (
          <InboxMessagesListSkeleton skeletonItems={10} />
        ) : (
          <InboxMessagesList chats={chats} />
        )}
      </div>
    </div>
  )
}
