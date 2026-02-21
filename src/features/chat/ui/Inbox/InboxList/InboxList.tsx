import { UserChatPreviewDTO } from "@/shared/schemes/chatPreview.schema"
import { ChatInboxItem } from "./InboxItem/InboxItem"
import { ChatInboxListSkeleton } from "./InboxListSkeleton"

type InboxMessageListProps = {
  chats: UserChatPreviewDTO[]
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
            initialLatestMessage={chat.latestMessage}
            name={chat.type === "DIRECT" ? chat.otherUser.name : chat.name}
            avatarUrl={chat.type === "DIRECT" ? chat.otherUser.imageUrl : ""}
            status="online"
          />
        </li>
      ))}
    </ul>
  )
}
