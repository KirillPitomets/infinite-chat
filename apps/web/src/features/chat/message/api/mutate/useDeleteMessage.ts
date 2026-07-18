import { edenClient } from "@/shared/lib/eden"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { ChatUIMessage, mapAPIMessageToUI } from "../../model/message.types"
import { useChangeMessageStatus } from "../useChangeMessageStatus"

export function useDeleteMessage(chatId: string) {
  const changeMessageStatus = useChangeMessageStatus()

  return useMutation<ChatUIMessage, Error, string>({
    mutationFn: async (messageId: string) => {
      const res = await edenClient.messages({messageId}).delete()

      if (res.status !== 200 || !res.data) {
        throw new Error(res.error?.value.message ?? "Failed to delete message")
      }

      return mapAPIMessageToUI(res.data, "deleted", false)
    },
    onMutate(messageId) {
      changeMessageStatus({ chatId, messageId: messageId, status: "loading" })
    },
    onSuccess(data) {
      if (data) {
        changeMessageStatus({ chatId, messageId: data.id, status: "deleted" })
      }
    },
    onError(error) {
      toast.error(error.message)
    }
  })
}
