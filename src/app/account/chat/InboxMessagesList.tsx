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
            chatId={chat.id}
            name={chat.type === "DIRECT" ? chat.otherUser.name : chat.name}
            photo={chat.type === "DIRECT" ? chat.otherUser.imageUrl : ""}
            status="online"
          />
        </li>
      ))}
    </ul>
  )
}
