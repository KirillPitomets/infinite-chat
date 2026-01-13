import Image from "next/image"
import Link from "next/link"
import {format} from "date-fns"
import {ACOOUNT_PAGES} from "@/config/accountPages.config"

type ChatItemProps = {
  id: string
  lastMessage?: {
    content: string
    createdAt: string
    isYourMessage: boolean
  }
  name: string
  photo: string
  status: "online" | "offline"
}

export default function ChatItem({
  id,
  lastMessage,
  name,
  photo,
  status
}: ChatItemProps) {
  return (
    <Link
      href={ACOOUNT_PAGES.CHAT_ID(id)}
      key={id}
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

      <div className="flex-1 max-w-45">
        <p className="text-zinc-950 font-semibold">{name}</p>
        <p className="text-zinc-500 truncate">
          {lastMessage ? (
            <>
              {lastMessage.isYourMessage ? "you: " : ""}
              {lastMessage.content}
            </>
          ) : (
            <p className="text-zinc-400">No message yet</p>
          )}
        </p>
      </div>

      {lastMessage?.createdAt && (
        <p className="text-zinc-600">
          {format(lastMessage.createdAt, "HH:MM")}
        </p>
      )}
    </Link>
  )
}
