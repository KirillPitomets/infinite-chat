import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import Image from "next/image"
import Link from "next/link"
import LatestMessage from "./LatestMessage"
import { ChatMessage } from "@/shared/schemes/message.schema"
import { usePresenceUserStatus } from "@/shared/hooks/useUserPresence"
import { useRealtimeTyping } from "@/features/chat/realtime/useRealtimeTyping"
import { TypingIndicator } from "@/shared/components/ui/TypingIndicator/TypingIndicator"
import { format } from "date-fns"
import { MessageStatus } from "../../../Message/Status"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"

export interface InboxLatestMessage extends ChatMessage {
  isRead: boolean
}

type ChatInboxItemProps = {
  chatId: string
  name: string
  avatarUrl: string
  memberId: string
  unreadConut: number
  latestMessage?: InboxLatestMessage
}

export const ChatInboxItem = ({
  chatId,
  name,
  avatarUrl,
  latestMessage,
  memberId,
  unreadConut = 0
}: ChatInboxItemProps) => {
  const user = useCurrentUser()
  const { isOnline } = usePresenceUserStatus(memberId)
  const { isMemberTyping, member } = useRealtimeTyping(chatId)

  return (
    <Link
      href={ACCOUNT_PAGES.CHAT_ID(chatId)}
      className="flex items-center gap-2 px-5 py-1 transition-colors dark:hover:bg-zinc-800 hover:bg-zinc-300 "
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
          <p className="font-semibold  first-letter:uppercase">{name}</p>
          {isMemberTyping && member.id === memberId ? (
            <TypingIndicator />
          ) : (
            <LatestMessage latestMessage={latestMessage} />
          )}
        </div>

        <div className="flex flex-col justify-between items-end">
          {latestMessage && (
            <>
              <p className="opacity-60">
                {format(latestMessage.createdAt, "HH:mm")}
              </p>
              {user.id === latestMessage.sender.id && (
                <MessageStatus
                  status={latestMessage.isRead ? "readed" : "sent"}
                />
              )}
            </>
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
