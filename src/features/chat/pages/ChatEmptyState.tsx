"use client"

import { ACOOUNT_PAGES } from "@/shared/config/accountPages.config"
import { edenClient } from "@/shared/lib/eden"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast"

export const ChatEmptyState = () => {
  const { user } = useUser()

  const [memberTag, setMemberTag] = useState<string>("")
  const router = useRouter()

  const handleMemberTag = (e: ChangeEvent<HTMLInputElement>) => {
    const tag = e.target.value

    if (tag.startsWith("@")) {
      return setMemberTag(tag.split("").slice(1, -1).join(""))
    }
    setMemberTag(tag)
  }

  const { mutate: createChat } = useMutation({
    mutationFn: async () => {
      const res = await edenClient.chat.create.post({
        memberTag: `@${memberTag}`
      })

      if (res.status !== 200 || !res.data) {
        throw new Error(
          res.error?.value.message ?? "Failed to create new chat :("
        )
      }

      router.push(ACOOUNT_PAGES.CHAT_ID(res.data.id))
    },
    onError: error => {
      toast.error(error.message)
    }
  })

  const { data: usersList, isLoading } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const res = await edenClient.user.all.get()

      return res.data
    }
  })

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full space-y-10">
      <h1 className="text-4xl">Welcome, <b>{user?.username || ""}</b>❤️😉</h1>
      <label className="flex items-center p-2 border border-zinc-600 rounded-2xl">
        <span>@</span>
        <input
          type="text"
          placeholder="userTag"
          value={memberTag}
          onChange={handleMemberTag}
        />
        <button onClick={() => createChat()}>Create</button>
      </label>
      Our people:
      {usersList ? (
        <ul>
          {usersList.map(user => (
            <li key={user.tag}>
              <span className="font-semibold">{user.name}: </span>
              <span className="text-zinc-500">{user.tag}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users :(</p>
      )}
    </div>
  )
}
