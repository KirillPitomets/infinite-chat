"use client"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { User } from "@/shared/types/api.type"
import { parseErrorMessage } from "@/shared/utils/parseErrorStatus"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

type ChatUserListProps = {
  initialData: User[]
}

export const ChatUserList = ({ initialData }: ChatUserListProps) => {
  const router = useRouter()
  const api = useApiClient()

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await unwrap(api.GET("/api/v1/user")),
    initialData
  })

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

  return users.length ? (
    <ul className="w-full max-w-150 max-h-140 overflow-scroll pr-2">
      {users.map(user => (
        <li
          key={user.id}
          className="flex items-center justify-between p-2 border-b border-zinc-400"
        >
          <div className="flex gap-2 items-center">
            <div className="flex items-center justify-center rounded-full font-medium text-white overflow-hidden max-w-10 max-h-10">
              <img
                src={user.imageUrl}
                alt={user.username}
                className=" w-full h-full object-cover"
              />
            </div>

            <span className="font-semibold">{user.firstName} </span>
            <span className="font-semibold">{user.lastName} </span>
          </div>
          <span className="font-semibold">{user.username}</span>

          <button
            className="p-2 rounded-2xl cursor-pointer hover:bg-green-400"
            onClick={() => createChat(user.id)}
            disabled={isPending}
          >
            Create chat
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <>
      <p className="text-xl">No users to start chatting with 🥲</p>
      <button onClick={() => refetch()}>refetch</button>
    </>
  )
}
