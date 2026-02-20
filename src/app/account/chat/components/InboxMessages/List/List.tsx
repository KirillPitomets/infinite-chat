import {UserChatPreviewDTO} from "@/shared/chatPreview.schema"
import {InboxMessagesItem} from "./Item/Item"
import {InboxMessagesListSkeleton} from "./ListSkeletn"

type InboxMessageListProps = {
  chats: UserChatPreviewDTO[]
  isLoadingSkeleton: boolean
}

export function InboxMessagesList({
  chats = [],
  isLoadingSkeleton
}: InboxMessageListProps) {
  if (isLoadingSkeleton) {
    return <InboxMessagesListSkeleton skeletonItems={10} />
  }

  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id}>
          <InboxMessagesItem
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
