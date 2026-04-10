import { ChatUIMessage } from "@/features/chat/message/model/message.types"
import { Message } from "@/features/chat/ui/Message/Message"
import { User } from "@/shared/types/User.type"
import { useEffect, useRef } from "react"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"
import { MessageListSkeleton } from "./Skeleton"

type MessageListProps = {
  chatId: string
  selectedMessageId?: string
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
  selectedMessageId,
  isReplyToMessage,
  isLoading,
  currentUser,
  handleUpdate,
  handleReplyToMessage,
  onDelete,
  onPreviewImage
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.scrollTop = el.scrollHeight
  }, [isEditMessage, isReplyToMessage, messages])

  return (
    <div
      ref={containerRef}
      className="relative flex-1 p-4 space-y-5 overflow-y-auto scrollbar-thin"
    >
      {isLoading ? (
        <MessageListSkeleton />
      ) : (
        messages.map(msg => (
          <Message
            key={msg.id}
            selectedMessageId={selectedMessageId}
            handleUpdate={handleUpdate}
            onDelete={onDelete}
            isMine={currentUser.id === msg.sender.id}
            onPreviewImage={onPreviewImage}
            handleReplyToMessage={handleReplyToMessage}
            {...msg}
          />
        ))
      )}
    </div>
  )
}
