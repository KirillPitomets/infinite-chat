import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "@/features/chat/message/model/message.types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { chatKeys } from "../../../chat/model/chat.keys"
import { useChangeMessageStatus } from "../useChangeMessageStatus"
import { useState } from "react"
import { MessageSocket } from "@/shared/lib/socket/socketFactory"
import { UpdateMessageDto } from "@/shared/types/api.type"

export type MessageUpdateFields = Pick<UpdateMessageDto, "text" | "attachments">

export function useUpdateMessage(chatId: string, socket: MessageSocket | null) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()

  const [isEditingMessage, setIsEditingMessage] = useState(false)
  const [editingMessage, setEditingMessage] = useState<ChatUIMessage | null>()

  const toggleIsEditMessage = () => setIsEditingMessage(prev => !prev)

  const handleEditingMessage = (message: ChatUIMessage) => {
    setEditingMessage(message)
    setIsEditingMessage(true)
  }

  const cancelUpdate = () => {
    setEditingMessage(null)
    setIsEditingMessage(false)
  }

  const { mutate } = useMutation<
    ChatUIMessage,
    Error,
    MessageUpdateFields,
    { previousMessages: ChatUIMessage[] }
  >({
    mutationFn: async dto => {
      if (!socket) {
        throw new Error("Invalid socket")
      }

      if (!editingMessage) {
        throw new Error("No have editing message")
      }

      const message = await socket.timeout(5000).emitWithAck("message.update", {
        ...dto,
        messageId: editingMessage.id,
        roomId: chatId
      })

      return mapAPIMessageToUI(message, "sent", false)
    },
    onMutate: async ({}) => {
      if (!editingMessage) {
        throw new Error("No have editing message")
      }

      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      })

      const previousMessages =
        queryClient.getQueryData<ChatUIMessage[]>([
          "getChatMessages",
          chatId
        ]) ?? []

      changeMessageStatus({
        chatId,
        messageId: editingMessage.id,
        status: "loading"
      })

      return { previousMessages }
    },
    onSuccess: data => {
      queryClient.setQueryData<ChatUIMessage[]>(
        chatKeys.messages(chatId),
        old => old?.map(msg => (msg.id === data.id ? data : msg)) ?? []
      )
      toast.success("Message have been updated")
      cancelUpdate()
    },
    onError: (error, _, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(chatId),
          context.previousMessages
        )
      }

      toast.error(error.message)
      cancelUpdate()
    }
  })

  return {
    handleUpdateMessage: mutate,
    isEditingMessage,
    toggleIsEditMessage,
    editingMessage,
    handleEditingMessage,
    cancelUpdate
  }
}
