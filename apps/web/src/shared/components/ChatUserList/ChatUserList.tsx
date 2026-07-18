import Image from "next/image"
import { IconButtonBase } from "../ui/IconButtonBase"
import { useMutation, useQuery } from "@tanstack/react-query"
import { edenClient } from "@/shared/lib/eden"
import { useRouter } from "next/navigation"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import toast from "react-hot-toast"
import { ChatUserListSkeleton } from "./Skeleton"

export const ChatUserList = () => {
  const router = useRouter()

  const { data: usersList, isLoading } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const res = await edenClient.user.all.get()

      return res.data?.sort(
        (a, b) =>
          new Date(a.createdAt).getSeconds() -
          new Date(b.createdAt).getSeconds()
      )
    }
  })

  const { mutate: createChat, isPending } = useMutation({
    mutationFn: async (tag: string) => {
      const res = await edenClient.chat.create.post({
        memberTag: tag
      })

      if (res.status !== 200 || !res.data) {
        throw new Error(
          res.error?.value.message ?? "Failed to create new chat :("
        )
      }

      router.push(ACCOUNT_PAGES.CHAT_ID(res.data.id))
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  if (isLoading) {
    return <ChatUserListSkeleton />
  }

  return usersList ? (
    <ul className="w-full max-w-150 max-h-140 overflow-scroll pr-2">
      {usersList.map(user => (
        <li
          key={user.tag}
          className="flex items-center justify-between p-2 border-b border-zinc-400"
        >
          <div className="flex gap-2">
            <Image
              width={30}
              height={20}
              src={user.imageUrl}
              alt={user.tag}
              className="rounded-full"
            />
            <span className="font-semibold">{user.name} </span>
          </div>
          <span className="font-semibold">{user.tag} </span>
          <IconButtonBase>
            <button onClick={() => createChat(user.tag)} disabled={isPending}>Create chat</button>
          </IconButtonBase>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-xl">No users to start chatting with 🥲</p>
  )
}
