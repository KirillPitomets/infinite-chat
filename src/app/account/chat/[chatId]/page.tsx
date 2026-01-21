"use client"

import {useParams} from "next/navigation"
import {ChatHeader} from "./ChatHeader"
import {ChatMessageInput} from "./ChatMessageInput"
import {useQuery} from "@tanstack/react-query"
import {edenClient} from "@/lib/eden"
import Image from "next/image"

const formatDate = (unix: string) => {
  // todo: add yersterday, if date is later then DD/MM | HH/MM
  const date = new Date(unix)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${hours >= 10 ? hours : "0" + hours}:${minutes >= 10 ? minutes : "0" + minutes}`
}

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

  const {data: messages} = useQuery({
    queryKey: ["getChatMessages"],
    queryFn: async () => {
      if (params.chatId) {
        const res = await edenClient.message.get({
          query: {chatId: params.chatId}
        })

        return res.data
      }
    }
  })


  return (
    <div className="w-full flex-1 flex flex-col justify-beetwen">
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

      <div className="flex-1 space-y-5 p-5.25">
        {messages &&
          messages.map(msg => (
            <div
              key={msg.id}
              className={`w-full flex ${msg.isMine && "justify-end"}`}
            >
              <div className="max-w-[80%] space-y-2">
                {!msg.isMine && (
                  <div className="flex space-x-2.5">
                    <Image
                      width={25}
                      height={25}
                      src={msg.sender.imageUrl}
                      alt={msg.sender.name}
                      className="rounded-2xl"
                    />
                    <p>{msg.sender.name}</p>
                  </div>
                )}
                <div className="inline-block p-4 rounded-2xl bg-zinc-100">
                  <p>{msg.content}</p>
                  <p className={`text-zinc-500 ${msg.isMine && "text-end"}`}>
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>

      <ChatMessageInput />
    </div>
  )
}
