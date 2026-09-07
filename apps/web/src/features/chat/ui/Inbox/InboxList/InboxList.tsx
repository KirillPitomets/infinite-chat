import { ChatRoom } from "@/shared/types/api.type"
import { ChatInboxItem } from "./InboxItem/InboxItem"
import { ChatInboxListSkeleton } from "./InboxListSkeleton"

type InboxMessageListProps = {
  chats: ChatRoom[]
  isLoadingSkeleton: boolean
}

export function ChatInboxList({
  chats,
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
            inboxChatId={chat.id}
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
