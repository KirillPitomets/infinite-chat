"use client"

import SearchInput from "@/components/ui/SearchInput/SearchInput"
import {useQuery} from "@tanstack/react-query"
import {edenClient} from "@/lib/eden"
import {InboxMessagesList} from "./InboxMessagesList"

export function InboxMessages() {
  const {data: chats, isLoading} = useQuery({
    queryKey: ["getUserChatsPreviewList"],
    queryFn: async () => {
      const data = await edenClient.chat.preview.get()
      if (data.status === 200) {
        return data.data
      }
      return null
    }
  })

  // TODO
  // if (isLoading) return <ChatsSkeleton />
  // if (error) return <ErrorState />

  return (
    <div className="py-7.5 h-screen flex flex-col border-r border-zinc-300">
      <div className="px-5 mb-5">
        <h2 className="mb-2 text-xl font-bold">Messages</h2>
        <SearchInput />
      </div>

      <div className="overflow-y-auto scroll-bar-thin">
        {chats && chats.length ? (
          <InboxMessagesList chats={chats} />
        ) : (
          <p className="text-2xl font-semibold text-center">No chats 😢</p>
        )}
      </div>
    </div>
  )
}
