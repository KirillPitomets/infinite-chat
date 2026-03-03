"use client"

import { useQuery } from "@tanstack/react-query"
import { edenClient } from "@/shared/lib/eden"
import { ChatInboxList } from "@/features/chat/ui/Inbox/InboxList/InboxList"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { useRealtime } from "@/shared/lib/realtime-client"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import SearchInput from "@/shared/components/ui/SearchInput/SearchInput"

export function ChatInbox() {
  const currentUser = useCurrentUser()

  const {
    data: chats = [],
    isLoading,
    refetch
  } = useQuery<UserChatPreview[]>({
    queryKey: ["getUserChatsPreviewList"],
    queryFn: async () => {
      const res = await edenClient.chat.preview.get()

      return res.data ?? []
    }
  })

  useRealtime({
    channels: ["chats"],
    events: ["chat.created", "chat.deleted"],
    onData: ({ data, event }) => {
      if (event === "chat.created" || event === "chat.deleted") {
        if (data.memberships.find(member => member.userId === currentUser.id)) {
          refetch()
        }
      }
    }
  })

  return (
    <div className="max-w-[30%] py-7.5 h-screen flex flex-col border-r border-zinc-300">
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
