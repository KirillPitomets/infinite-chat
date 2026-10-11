"use client"
import { useCreateGroupChat } from "@/features/chat/chat/api/mutate/useCreateGroupChat"
import { Button } from "@/shared/components/ui/Button"
import { useInput } from "@/shared/hooks/useInput"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { User } from "@/shared/types/api.type"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Loader } from "../ui/Loader"
import { ChatUserListItem } from "./ChatUserListItem"

type ChatUserListProps = {
  initialData: User[]
}

export const ChatUserList = ({ initialData }: ChatUserListProps) => {
  const api = useApiClient()
  const { value: groupName, onChange } = useInput("")
  const [membershipsIds, setMembershipsIds] = useState<string[]>([])
  const [chatTypeForCreate, setChatTypeForCreate] = useState<
    "GROUP" | "DIRECT"
  >("DIRECT")

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => await unwrap(api.GET("/api/v1/user")),
    initialData
  })

  const { createGroupChat, isPending } = useCreateGroupChat()

  const handleCreateGroupChat = () => {
    createGroupChat({ groupName, membershipsIds })
  }

  const handleUserOfGroup = (userId: string) => {
    setMembershipsIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleChatTypeForCreate = () => {
    setChatTypeForCreate(prev => {
      if (prev === "DIRECT") return "GROUP"
      return "DIRECT"
    })
  }

  if (!users.length) {
    return <p className="text-xl">No users to start chatting with 🥲</p>
  }

  return (
    <div className="w-full flex items-center flex-col gap-1">
      <ul className="w-full max-w-150 max-h-140 overflow-scroll pr-2">
        {users.map(user => (
          <ChatUserListItem
            key={user.id}
            user={user}
            chatTypeForCreate={chatTypeForCreate}
            onToggleUserOfGroup={userId => handleUserOfGroup(userId)}
            isSelected={membershipsIds.includes(user.id)}
          />
        ))}
      </ul>

      {chatTypeForCreate == "GROUP" ? (
        <div className="flex items-center gap-1">
          {isPending && <Loader />}
          <input
            className="border border-green-400 p-1"
            placeholder="Enter group name"
            value={groupName}
            onChange={onChange}
            disabled={isPending}
          />
          <Button onClick={handleCreateGroupChat} disabled={isPending}>
            Create
          </Button>
          <Button
            onClick={toggleChatTypeForCreate}
            tone="danger"
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <p className="italic">Or you wanna make a group?</p>
          <Button onClick={toggleChatTypeForCreate}> Make group </Button>
        </div>
      )}
    </div>
  )
}
