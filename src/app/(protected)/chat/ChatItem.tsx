import Image from "next/image"
import {IChatItem} from "../../../data/chats.data"
import Link from "next/link"
import {format} from "date-fns"

export default function ChatItem({
  id,
  lastMessage,
  messageCreatedAt,
  name,
  photo,
  status
}: IChatItem) {
  return (
    <Link
      href={`/chat/${id}`}
      key={id}
      className="flex gap-2 py-1 px-5 transition-colors hover:bg-zinc-300"
    >
      <div className="w-8 flex justify-center items-center relative">
        <Image
          className="rounded-full"
          width={36}
          height={36}
          src={photo}
          alt={`Photo - ${name}`}
        />
        {status === "online" && (
          <div className="w-2 h-2 rounded-2xl bg-green-400 absolute bottom-1.5 right-0" />
        )}
      </div>
      <div className="flex-1 max-w-45">
        <p className="text-zinc-900">{name}</p>
        <p className="text-zinc-500 truncate">{lastMessage}</p>
      </div>

      <p className="text-zinc-600">{format(messageCreatedAt, "HH:MM")}</p>
    </Link>
  )
}
