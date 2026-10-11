import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { parseErrorMessage } from "@/shared/utils/parseErrorStatus"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const useCreateOrFindDirectChat = () => {
  const api = useApiClient()
  const router = useRouter()

  const { mutate: createChat, isPending } = useMutation({
    mutationFn: async (memberId: string) => {
      const room = await unwrap(
        api.POST("/api/v1/room/direct", { body: { memberId } })
      )
      router.push(ACCOUNT_PAGES.CHAT_ID(room.id))
    },
    onError(error, variables, onMutateResult, context) {
      const { text } = parseErrorMessage(error.message)
      toast.error(text)
    }
  })

  return {
    createChat,
    isPending
  }
}
