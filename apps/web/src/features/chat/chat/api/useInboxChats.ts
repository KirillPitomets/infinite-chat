import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { ChatRoom } from "@/shared/types/api.type"
import { useQuery } from "@tanstack/react-query"
import { chatKeys } from "../model/chat.keys"

export function useInboxChats(initialData: ChatRoom[]) {
  const api = useApiClient()

  return useQuery<ChatRoom[]>({
    queryKey: chatKeys.inbox(),
    queryFn: async () => {
      return await unwrap(api.GET("/api/v1/room"))
    },
    initialData
  })
}

/*
  // const { data: chats, isLoading } = useQuery<ChatRoom[]>({
  //   queryKey: chatKeys.inbox(),
  //   // == TODO ==
  //   queryFn: async () => {
  //     const rooms = await unwrap()
  //     //   const res = await edenClient.chat.preview.get()

  //   //   return res.data ?? []
  //   },
  //   select: chats =>
  //     [...chats].sort(
  //       (a, b) =>
  //         new Date(b.latestMessage?.createdAt ?? 0).getTime() -
  //         new Date(a.latestMessage?.createdAt ?? 0).getTime()
  //     ),
  //   initialData: initialChatRooms
  // })

*/
