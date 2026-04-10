import {
  ChatUIMessage
} from "@/features/chat/message/model/message.types"
import { Message } from "@/features/chat/ui/Message/Message"
import { User } from "@/shared/types/User.type"
import { useEffect, useRef } from "react"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"
import { MessageListSkeleton } from "./Skeleton"

type MessageListProps = {
  chatId: string
  messages: ChatUIMessage[]
  isEditMessage: boolean
  isLoading: boolean
  currentUser: User
  isReplyToMessage: boolean
  handleUpdate: (editingMessage: EditingMessage) => void
  handleReplyToMessage: (message: ChatUIMessage) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const MessageList = ({
  messages,
  isEditMessage,
  isReplyToMessage,
  isLoading,
  currentUser,
  handleUpdate,
  handleReplyToMessage,
  onDelete,
  onPreviewImage
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [isEditMessage, isReplyToMessage, messages.length])

  return (
    <div className="relative flex-1 p-4 space-y-5 overflow-y-auto scrollbar-thin">
      {isLoading ? (
        <MessageListSkeleton />
      ) : (
        messages.map(msg => (
          <Message
            key={msg.id}
            handleUpdate={handleUpdate}
            onDelete={onDelete}
            isMine={currentUser.id === msg.sender.id}
            onPreviewImage={onPreviewImage}
            handleReplyToMessage={handleReplyToMessage}
            {...msg}
          />
        ))
      )}
      <div ref={messagesEndRef}></div>
    </div>
  )
}
