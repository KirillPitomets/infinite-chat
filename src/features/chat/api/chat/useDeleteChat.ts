import { ACOOUNT_PAGES } from "@/shared/config/accountPages.config"
import { edenClient } from "@/shared/lib/eden"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export function useDeleteChat(chatId: string) {
  const route = useRouter()

  return useMutation({
    mutationKey: ["chatHeader_deleteChat", chatId],
    mutationFn: async () => {
      const res = await edenClient.chat.delete({ chatId })
      if (res.status === 200) {
        route.replace(ACOOUNT_PAGES.CHAT)
      }
    }
  })
}
