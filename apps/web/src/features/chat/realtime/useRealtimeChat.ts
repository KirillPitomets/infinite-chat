import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { useChangeMessageStatus } from "@/features/chat/message/api/useChangeMessageStatus"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { MessageSocket } from "@/shared/lib/socket/socketFactory"
import { Message } from "@/shared/types/api.type"
import { replaceMessageInCache } from "@/shared/utils/replaceMessageInCache"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

export function useRealtimeChat(
  chatId: string,
  messageSocket: MessageSocket | null
) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()

  useEffect(() => {
    if (!messageSocket) return

    const handleCreated = (message: Message) => {
      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),

        old => [...(old ?? []), mapAPIMessageToUI(message, "sent", false)]
      )
    }

    const handleUpdated = (message: Message) => {
      replaceMessageInCache(queryClient, chatId, message, "sent")
    }

    const handleDeleted = (message: Message) => {
      replaceMessageInCache(queryClient, chatId, message, "deleted")
    }

    const handleRestored = (message: Message) => {
      replaceMessageInCache(queryClient, chatId, message, "sent")
    }

    const handleException = (err: unknown) => console.log(err)

    messageSocket.on("message.created", handleCreated)
    messageSocket.on("message.updated", handleUpdated)
    messageSocket.on("message.deleted", handleDeleted)
    messageSocket.on("message.restored", handleRestored)
    messageSocket.on("exception", handleException)

    return () => {
      messageSocket.off("message.created", handleCreated)
      messageSocket.off("message.updated", handleUpdated)
      messageSocket.off("message.deleted", handleDeleted)
      messageSocket.off("message.restored", handleRestored)
      messageSocket.off("exception", handleException)
    }
  }, [messageSocket, chatId, queryClient, changeMessageStatus])
}
