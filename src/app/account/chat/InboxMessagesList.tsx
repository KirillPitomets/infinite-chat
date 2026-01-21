import {UserChatPreviewDTO} from "@/shared/chatPreview.schema"
import ChatItem from "./ChatItem"

type InboxMessageListProps = {
  chats: UserChatPreviewDTO[]
}

export function InboxMessagesList({chats}: InboxMessageListProps) {
  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id}>
          <ChatItem
            id={chat.id}
            name={chat.type === "DIRECT" ? chat.otherUser.name : chat.name}
            lastMessage={
              chat.lastMessage
                ? {
                    content: chat.lastMessage.content,
                    createdAt: chat.lastMessage.createdAt,
                    isMine: chat.lastMessage.isMine,
                    senderName: chat.lastMessage.senderName
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
