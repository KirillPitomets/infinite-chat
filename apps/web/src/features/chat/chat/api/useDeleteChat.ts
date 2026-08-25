import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function useDeleteChat(chatId: string) {
  const route = useRouter()

  return useMutation({
    mutationKey: ["chatHeader_deleteChat", chatId],
    mutationFn: async () => {
      // == TODO ==
      // const res = await edenClient.chat({ chatId }).delete()
      // if (res.status === 200) {
      //   route.replace(ACCOUNT_PAGES.CHAT)
      // }
    }
  })
}
