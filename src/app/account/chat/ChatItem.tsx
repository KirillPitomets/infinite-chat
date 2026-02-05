import Image from "next/image"
import Link from "next/link"
import {format} from "date-fns"
import {ACOOUNT_PAGES} from "@/config/accountPages.config"
import {useMutation, useQuery} from "@tanstack/react-query"
import {edenClient} from "@/lib/eden"
import {useRealtime} from "@/lib/realtime-client"

type ChatItemProps = {
  chatId: string
  name: string
  photo: string
  status: "online" | "offline"
}

export default function ChatItem({
  chatId,
  name,
  photo,
  status
}: ChatItemProps) {
  const {data: latestMessage, refetch} = useQuery({
    queryKey: ["getLatestMessage: ", chatId],
    queryFn: async () => {
      if (chatId) {
        const res = await edenClient.message.latest.get({query: {chatId}})
        return res.data
      }
    }
  })

  useRealtime({
    channels: [chatId],
    events: ["chat.message"],
    onData({event}) {
      if (event === "chat.message") {
        refetch()
      }
    }
  })

  return (
    <Link
      href={ACOOUNT_PAGES.CHAT_ID(chatId)}
      key={chatId}
      className="flex gap-2 py-1 px-5 transition-colors hover:bg-zinc-300"
    >
      <div className="w-8 flex justify-center items-center relative">
        {photo ? (
          <Image
            className="rounded-full"
            width={36}
            height={36}
            src={photo}
            alt={`Photo - ${name}`}
          />
        ) : (
          <></>
        )}
        {status === "online" && (
          <div className="w-2 h-2 rounded-2xl bg-green-400 absolute bottom-1.5 right-0" />
        )}
      </div>

      <div className="flex-1 max-w-35">
        <p className="text-zinc-950 font-semibold">{name}</p>

        {latestMessage ? (
          <p className="text-zinc-500 truncate">
            {latestMessage.isMine ? "you: " : `${latestMessage.sender.name}: `}
            {latestMessage.content}
          </p>
        ) : (
          <span className="text-zinc-400">No message yet</span>
        )}
      </div>

      {latestMessage?.createdAt && (
        <p className="text-zinc-600">
          {format(latestMessage.createdAt, "HH:MM")}
        </p>
      )}
    </Link>
  )
}
