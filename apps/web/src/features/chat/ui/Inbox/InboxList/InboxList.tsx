import { isReadMessage } from "@/shared/utils/isReadMessage"
import { ChatInboxItem } from "./InboxItem/InboxItem"
import { ChatInboxListSkeleton } from "./InboxListSkeleton"
import { ChatRoom } from "@/shared/types/api.type"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"

type InboxMessageListProps = {
  chats: ChatRoom[]
  isLoadingSkeleton: boolean
}

export function ChatInboxList({
  chats = [],
  isLoadingSkeleton
}: InboxMessageListProps) {
  if (isLoadingSkeleton) {
    return <ChatInboxListSkeleton skeletonItems={10} />
  }

  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id}>
          <ChatInboxItem
            chatId={chat.id}
            avatarUrl={chat.avatarUrl}
            name={chat.name}
            type={chat.type}
            memberships={chat.memberships}
          />
        </li>
      ))}
    </ul>
  )
}
