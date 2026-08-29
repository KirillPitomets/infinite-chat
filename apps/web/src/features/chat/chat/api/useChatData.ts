import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../model/chat.keys"
import { useRouter } from "next/navigation"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import toast from "react-hot-toast"
import { Room } from "@/shared/types/api.type"

export function useChatRoomData(chatId: string, initialData: Room) {
  const router = useRouter()

  return useQuery({
    enabled: !!chatId,
    queryKey: chatKeys.data(chatId),
    queryFn: async () => {
      // == TODO ==
      // const res = await edenClient.chat({ chatId }).get()
      // if (res.status !== 200 || !res.data) {
      //   if (res.error) {
      //     toast.error(res.error.value.message ?? "Can't load this chat :(")
      //   }
      //   router.replace(ACCOUNT_PAGES.CHAT)
      // }
      // return res.data
    },
    initialData
  })
}
