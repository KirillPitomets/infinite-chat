"use client"

import SearchInput from "@/components/ui/SearchInput/SearchInput"
import {useQuery} from "@tanstack/react-query"
import {edenClient} from "@/lib/eden"
import {useUser} from "@/hooks/useUser"
import {InboxMessagesList} from "./InboxMessagesList"

export function InboxMessages() {
  const {user} = useUser()
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
        <h2 className="text-xl font-bold mb-2">Messages</h2>
        <SearchInput />
      </div>

      <div className="overflow-y-auto scroll-bar-thin">
        {!isLoading ? (
          chats ? (
            <InboxMessagesList chats={chats} currentUserId={user!.id} />
          ) : (
            <p className="text-2xl font-semibold text-center">No chats 😢</p>
          )
        ) : (
          <p className="text-2xl font-semibold text-center"> Loading... </p>
        )}
      </div>
    </div>
  )
}
