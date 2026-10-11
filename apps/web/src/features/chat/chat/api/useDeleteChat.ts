import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { parseErrorMessage } from "@/shared/utils/parseErrorStatus"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function useDeleteChat(chatId: string) {
  const route = useRouter()
  const api = useApiClient()

  return useMutation({
    mutationKey: ["chatHeader_deleteChat", chatId],
    mutationFn: async () => {
      await unwrap(
        api.DELETE("/api/v1/room/{roomId}", {
          params: { path: { roomId: chatId } }
        })
      )
    },
    onSuccess() {
      route.push(ACCOUNT_PAGES.CHAT)
    },
    onError(err) {
      const { text } = parseErrorMessage(err.message)
      toast.error(text)
    }
  })
}
