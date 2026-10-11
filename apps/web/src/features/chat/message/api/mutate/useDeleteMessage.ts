import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { ChatUIMessage, mapAPIMessageToUI } from "../../model/message.types"
import { useChangeMessageStatus } from "../useChangeMessageStatus"
import { MessageSocket } from "@/shared/lib/socket/socketFactory"
import { chatKeys } from "@/features/chat/chat/model/chat.keys"

export function useDeleteMessage(chatId: string, socket: MessageSocket | null) {
  const queryClient = useQueryClient()
  const changeMessageStatus = useChangeMessageStatus()

  return useMutation<ChatUIMessage, Error, string>({
    mutationFn: async (messageId: string) => {
      if (!socket) {
        throw new Error("Invalid socket")
      }
      const res = await socket
        .timeout(5000)
        .emitWithAck("message.delete", { roomId: chatId, messageId })

      return mapAPIMessageToUI(res, "deleted", false)
    },
    onMutate(messageId) {
      changeMessageStatus({ chatId, messageId: messageId, status: "loading" })
    },
    onSuccess(data) {
      if (data) {
        queryClient.setQueryData<ChatUIMessage[]>(
          chatKeys.messages(chatId),
          old => old?.map(msg => (msg.id === data.id ? data : msg)) ?? []
        )
      }
    },
    onError(error) {
      toast.error(error.message)
    }
  })
}
