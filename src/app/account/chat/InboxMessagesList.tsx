import {UserChatPreviewDTO} from "@/shared/chatPreview.schema"
import ChatItem from "./ChatItem"

type InboxMessageListProps = {
  chats: UserChatPreviewDTO[]
  currentUserId: string
}

export function InboxMessagesList({
  chats,
  currentUserId
}: InboxMessageListProps) {
  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id}>
          <ChatItem
            id={chat.id}
            name={chat.otherUser.name}
            lastMessage={
              chat.lastMessage
                ? {
                    content: chat.lastMessage.content,
                    createdAt: chat.lastMessage.createdAt.toString(),
                    isYourMessage: currentUserId === chat.lastMessage.senderId
                  }
                : undefined
            }
            photo=""
            status="online"
          />
        </li>
      ))}
    </ul>
  )
}
