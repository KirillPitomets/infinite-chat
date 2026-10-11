import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { parseErrorMessage } from "@/shared/utils/parseErrorStatus"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export const useCreateGroupChat = () => {
  const api = useApiClient()
  const router = useRouter()

  const { mutate: createGroupChat, isPending } = useMutation({
    mutationFn: async ({
      groupName,
      membershipsIds
    }: {
      groupName: string
      membershipsIds: string[]
    }) => {
      if (!groupName.trim()) {
        toast.error("Group name is empty!")
      }

      const res = await unwrap(
        api.POST("/api/v1/room/group", {
          body: {
            memberIds: membershipsIds,
            name: groupName
          }
        })
      )

      return res
    },
    onSuccess: async data => {
      router.push(ACCOUNT_PAGES.CHAT_ID(data.id))
    },
    onError(error, variables, onMutateResult, context) {
      const { text } = parseErrorMessage(error.message)
      toast.error(text)
    }
  })

  return {
    createGroupChat,
    isPending
  }
}
