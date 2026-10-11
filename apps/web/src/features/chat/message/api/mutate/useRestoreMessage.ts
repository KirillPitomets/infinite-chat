import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ChatUIMessage, mapAPIMessageToUI } from "../../model/message.types"
import toast from "react-hot-toast"
import { MessageSocket } from "@/shared/lib/socket/socketFactory"
import { chatKeys } from "@/features/chat/chat/model/chat.keys"

export const useRestoreMessage = (
  chatId: string,
  socket: MessageSocket | null
) => {
  const queryClient = useQueryClient()

  const { mutate: handleRestoreMessage } = useMutation({
    mutationFn: async (messageId: string) => {
      if (!socket) {
        throw new Error("Invalid socket")
      }

      const res = await socket
        .timeout(5000)
        .emitWithAck("message.restore", { roomId: chatId, messageId })

      return mapAPIMessageToUI(res, "sent", false)
    },
    onSuccess(message) {
      if (message) {
        queryClient.setQueryData<ChatUIMessage[]>(
          chatKeys.messages(chatId),
          old => old?.map(msg => (msg.id === message.id ? message : msg)) ?? []
        )
      }
    },
    onError(error) {
      toast.error(error.message)
    }
  })

  return {
    handleRestoreMessage
  }
}
