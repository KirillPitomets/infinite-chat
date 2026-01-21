"use client"

import {ACOOUNT_PAGES} from "@/config/accountPages.config"
import {edenClient} from "@/lib/eden"
import { useUser } from "@clerk/nextjs"
import {useMutation, useQuery} from "@tanstack/react-query"
import {useRouter} from "next/navigation"
import {ChangeEvent, useState} from "react"

export default function ChatPage() {
  const {user} = useUser()

  const [memberTag, setMemberTag] = useState<string>("")
  const router = useRouter()

  const handleMemberTag = (e: ChangeEvent<HTMLInputElement>) => {
    setMemberTag(e.target.value)
  }

  const {mutate: createChat} = useMutation({
    mutationFn: async () => {
      const res = await edenClient.chat.create.post({memberTag})

      if (res.status === 200 && res.data) {
        router.push(ACOOUNT_PAGES.CHAT_ID(res.data.id))
      }
    }
  })

  const {data: usersList, isLoading} = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const res = await edenClient.user.all.get();

      if (res.status === 200) {
        return res.data
      }
      return null
    }
  })

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center space-y-10">
      <h1 className="text-4xl">Welcome, {user?.fullName}❤️😉</h1>
      <label className="border border-zinc-600 rounded-2xl p-2 flex items-center">
        <span>@</span>
        <input
          type="text"
          placeholder="userTag"
          value={memberTag}
          onChange={handleMemberTag}
        />
        <button className="" onClick={() => createChat()}>
          Create
        </button>
      </label>
      Our people:
      {usersList ? (
        <ul>
          {usersList.map(user => (
            <li key={user.tag}>{user.tag}</li>
          ))}
        </ul>
      ) : (
        <p>No users :(</p>
      )}
    </div>
  )
}
