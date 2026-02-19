import {ACOOUNT_PAGES} from "@/config/accountPages.config"
import Image from "next/image"
import Link from "next/link"
import LatestMessage from "./LatestMessage"
import {ChatMessageDTO} from "@/shared/message.schema"

type InboxMessagesItemProps = {
  chatId: string
  name: string
  avatarUrl: string
  status: "online" | "offline"
  initialLatestMessage?: ChatMessageDTO | null | undefined
}

export const InboxMessagesItem = ({
  chatId,
  name,
  avatarUrl,
  initialLatestMessage,
  status
}: InboxMessagesItemProps) => {
  return (
    <Link
      href={ACOOUNT_PAGES.CHAT_ID(chatId)}
      className="flex gap-2 px-5 py-1 transition-colors hover:bg-zinc-300"
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-300">
        {avatarUrl && (
          <Image
            className="rounded-full"
            width={36}
            height={36}
            src={avatarUrl}
            alt={name}
          />
        )}

        {status === "online" && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold">{name}</p>
        <LatestMessage
          chatId={chatId}
          initialLatestMessage={initialLatestMessage}
        />
      </div>
    </Link>
  )
}
