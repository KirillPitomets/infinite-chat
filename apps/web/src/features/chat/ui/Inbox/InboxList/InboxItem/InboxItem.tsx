import { useGetLatestMessage } from "@/features/chat/message/api/query/useGetLatestMessage"
import { messageKeys } from "@/features/chat/message/model/message.keys"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { ChatRoom, Message } from "@/shared/types/api.type"
import { getDirectChatPartner } from "@/shared/utils/getDirectChatPartner"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MessageStatus } from "../../../Message/Status"
import LatestMessage from "./LatestMessage"

export interface InboxLatestMessage extends Message {
  isRead: boolean
}

type ChatInboxItemProps = {
  inboxChatId: string

  type: ChatRoom["type"]
  memberships: ChatRoom["memberships"]
  name: string
  avatarUrl: string

  // memberId: string
  // unreadConut: number
}

export const ChatInboxItem = ({
  inboxChatId,
  avatarUrl,
  name,
  memberships,
  type

  // memberId,
  // unreadConut = 0
}: ChatInboxItemProps) => {
  const currentUser = useCurrentUser()
  // const { isOnline } = usePresenceUserStatus(memberId)
  // const { isMemberTyping, member } = useRealtimeTyping(chatId)

  const { chatId: openedChatId } = useParams()
  const directChatPartner = getDirectChatPartner(memberships, currentUser.id)
  const me = memberships.find(member => member.user.id === currentUser.id)

  const { latestMessage } = useGetLatestMessage(inboxChatId)

  const api = useApiClient()

  const { data: unreadCount } = useQuery({
    queryKey: messageKeys.unreadCountMessages(inboxChatId),
    queryFn: async () => {
      const res = await unwrap(
        api.GET("/api/v1/message/unread-count/{roomId}", {
          params: { path: { roomId: inboxChatId } }
        })
      )

      return res.unreadCount
    },
    initialData: 0
  })

  return (
    <Link
      href={ACCOUNT_PAGES.CHAT_ID(inboxChatId)}
      className={`flex items-center gap-2 px-5 py-1 transition-colors dark:hover:bg-zinc-800 hover:bg-zinc-300 ${openedChatId === inboxChatId && " dark:bg-zinc-800 bg-zinc-300 "}`}
    >
      <div className="relative flex items-center justify-center rounded-full">
        <UserAvatar
          size={7}
          alt={name}
          url={
            type === "DIRECT" && directChatPartner
              ? directChatPartner.imageUrl
              : avatarUrl
          }
        />

        {type === "DIRECT" && true /*isOnline*/ && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>
      <div className="flex justify-between w-full">
        <div>
          <p className="font-semibold  first-letter:uppercase">
            {type === "DIRECT" &&
              directChatPartner &&
              directChatPartner.username}
            {type === "GROUP" && name}
          </p>

          {/* 
          {isMemberTyping && member.id === memberId ? (
            <TypingIndicator />
          ) : (
            )} 
          */}

          <LatestMessage latestMessage={latestMessage} />
        </div>

        <div className="flex flex-col justify-between items-end">
          {latestMessage && (
            <>
              <p className="opacity-60">
                {format(latestMessage.createdAt, "HH:mm")}
              </p>
              {currentUser.id === latestMessage.sender.id && (
                <MessageStatus
                  status={
                    !!memberships.find(
                      m => m.lastReadAt >= latestMessage.createdAt
                    )
                      ? "readed"
                      : "sent"
                  }
                />
              )}
            </>
          )}

          {unreadCount > 0 && (
            <div className="flex items-center justify-center px-1 min-w-5 h-5 text-sm bg-green-500 rounded-full text-white ">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
