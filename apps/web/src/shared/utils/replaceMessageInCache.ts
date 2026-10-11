import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import {
  ChatUIMessageStatus,
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { QueryClient } from "@tanstack/react-query"
import { Message } from "../types/api.type"

export function replaceMessageInCache(
  queryClient: QueryClient,
  chatId: string,
  message: Message,
  status: ChatUIMessageStatus
) {
  queryClient.setQueryData<ChatUIMessage[]>(chatKeys.messages(chatId), old =>
    old
      ? old.map(msg =>
          msg.id === message.id
            ? mapAPIMessageToUI(message, status, false)
            : msg
        )
      : []
  )
}
