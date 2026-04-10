"use client"

import { ChatUserList } from "@/shared/components/ChatUserList/ChatUserList"
import { useUser } from "@clerk/nextjs"

export default function AccountPage() {
  const { user } = useUser()

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col items-center justify-center flex-1 w-full h-full space-y-10">
        <h1 className="text-4xl">
          Welcome, <b>{user?.username || ""}</b>❤️😉
        </h1>

        <ChatUserList/>
      </div>
    </div>
  )
}
