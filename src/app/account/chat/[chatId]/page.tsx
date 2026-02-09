"use client"

import {useParams} from "next/navigation"
import {ChatHeader} from "./components/ChatHeader"
import {edenClient} from "@/lib/eden"
import ChatMessageList from "./components/ChatMessageList"
import { useQuery } from "@tanstack/react-query"


export default function Page() {
  const params = useParams<{chatId: string}>()

  const {data: chat} = useQuery({
    queryKey: ["getChatData"],
    queryFn: async () => {
      if (params.chatId) {
        const res = await edenClient
          .chat({chatId: params.chatId.toString()})
          .get()
        return res.data
      }
    }
  })

  return (
    <div className="flex flex-col flex-1 w-full justify-beetwen">
      {chat?.type === "DIRECT" && (
        <ChatHeader
          name={chat.otherUser.name}
          tag={chat.otherUser.tag}
          imageUrl={chat.otherUser.imageUrl}
          status="offline"
          type={chat.type}
          membersCount={2}
        />
      )}

      {chat?.type === "GROUP" && (
        <ChatHeader
          name={chat.name}
          imageUrl={chat.imageUrl}
          type={chat.type}
          membersCount={chat.membersCount}
        />
      )}

      <ChatMessageList />
    </div>
  )
}
