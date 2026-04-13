import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import Image from "next/image"
import Link from "next/link"
import LatestMessage from "./LatestMessage"
import { ChatMessage } from "@/shared/schemes/message.schema"
import { usePresenceUserStatus } from "@/shared/hooks/useUserPresence"
import { useRealtimeTyping } from "@/features/chat/realtime/useRealtimeTyping"
import { TypingIndicator } from "@/shared/components/ui/TypingIndicator/TypingIndicator"
import { format } from "date-fns"

type ChatInboxItemProps = {
  chatId: string
  name: string
  avatarUrl: string
  memberId: string
  unreadConut: number
  latestMessage?: ChatMessage | null | undefined
}

export const ChatInboxItem = ({
  chatId,
  name,
  avatarUrl,
  latestMessage,
  memberId,
  unreadConut = 0
}: ChatInboxItemProps) => {
  const { isOnline } = usePresenceUserStatus(memberId)
  const { isMemberTyping, member } = useRealtimeTyping(chatId)

  return (
    <Link
      href={ACCOUNT_PAGES.CHAT_ID(chatId)}
      className="flex items-center gap-2 px-5 py-1 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-300 "
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full">
        {avatarUrl && (
          <Image
            className="rounded-full"
            width={36}
            height={36}
            src={avatarUrl}
            alt={name}
          />
        )}

        {isOnline && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>

      <div className="flex justify-between w-full">
        <div>
          <p className="font-semibold">{name}</p>
          {isMemberTyping && member.id === memberId ? (
            <TypingIndicator />
          ) : (
            <LatestMessage latestMessage={latestMessage} />
          )}
        </div>

        <div className="flex flex-col items-end">
          {latestMessage && (
            <p className="opacity-60">
              {format(latestMessage.createdAt, "HH:mm")}
            </p>
          )}

          {unreadConut > 0 && (
            <div className="flex items-center justify-center px-1 min-w-5 h-5  text-sm bg-green-500 rounded-full text-white ">
              {unreadConut}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
