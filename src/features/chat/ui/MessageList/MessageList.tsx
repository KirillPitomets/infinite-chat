import { Message } from "@/features/chat/ui/Message/Message"
import { useEffect, useRef } from "react"
import { ChatUIMessage } from "@/features/chat/model/chat.types"
import { User } from "@/shared/types/User.type"
import { MessageListSkeleton } from "./Skeleton"

type MessageListProps = {
  chatId: string
  messages: ChatUIMessage[]
  isEditMessage: boolean
  isLoading: boolean
  currentUser: User
  onUpdate: (id: string, initialValue: string) => void
  onDelete: (id: string) => void
}

export const MessageList = ({
  messages,
  isEditMessage,
  isLoading,
  currentUser,
  onUpdate,
  onDelete
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [messages.length, isEditMessage])

  return (
    <>
      <div className="flex-1 space-y-5 p-5.25 overflow-y-auto scrollbar-thin">
        {isLoading ? (
          <MessageListSkeleton />
        ) : (
          messages.map(msg => (
            <Message
              key={msg.id}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isMine={currentUser.id === msg.sender.id}
              {...msg}
            />
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>
    </>
  )
}
