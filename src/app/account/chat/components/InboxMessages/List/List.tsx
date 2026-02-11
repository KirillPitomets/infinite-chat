import {UserChatPreviewDTO} from "@/shared/chatPreview.schema"
import {InboxMessagesItem} from "./Item/Item"

type InboxMessageListProps = {
  chats: UserChatPreviewDTO[]
}

export function InboxMessagesList({chats}: InboxMessageListProps) {
  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id}>
          <InboxMessagesItem
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
