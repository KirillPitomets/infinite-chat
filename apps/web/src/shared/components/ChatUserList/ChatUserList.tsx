"use client"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { User } from "@/shared/types/api.type"
import { UserAvatar } from "../ui/UserAvatar/UserAvatar"
import { useCreateOrFindDirectChat } from "@/features/chat/chat/api/mutate/useCreateOrFindDirectChat"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/shared/components/ui/Button"

type ChatUserListProps = {
  initialData: User[]
}

export const ChatUserList = ({ initialData }: ChatUserListProps) => {
  const api = useApiClient()

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await unwrap(api.GET("/api/v1/user")),
    initialData
  })

  const { isPending, createChat } = useCreateOrFindDirectChat()

  return users.length ? (
    <ul className="w-full max-w-150 max-h-140 overflow-scroll pr-2">
      {users.map(user => (
        <li
          key={user.id}
          className="flex items-center justify-between p-2 border-b border-zinc-400"
        >
          <div className="flex gap-2 items-center">
            <UserAvatar url={user.imageUrl} alt={user.username} size={10} />

            <span className="font-semibold">{user.firstName} </span>
            <span className="font-semibold">{user.lastName} </span>
          </div>
          <span className="font-semibold">{user.username}</span>

          <Button onClick={() => createChat(user.id)} isPending={isPending}>
            Create chat
          </Button>
        </li>
      ))}
    </ul>
  ) : (
    <>
      <p className="text-xl">No users to start chatting with 🥲</p>
    </>
  )
}
