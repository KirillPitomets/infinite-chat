import { edenClient } from "@/shared/lib/eden"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useChangeMessageStatus } from "./useChangeMessageStatus"

export function useDeleteMessage(chatId: string) {
  const changeMessageStatus = useChangeMessageStatus()

  return useMutation({
    mutationFn: async (messageId: string) => {
      const res = await edenClient.message({ messageId }).delete()
      if (res.status !== 200) {
        throw new Error(res.error?.value.message ?? "Failed to delete message")
      }
      return res.data
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
