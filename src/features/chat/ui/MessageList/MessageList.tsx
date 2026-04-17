import { ChatUIMessage } from "@/features/chat/message/model/message.types"
import { Message } from "@/features/chat/ui/Message/Message"
import { useThrottle } from "@/shared/hooks/useThrottle"
import { edenClient } from "@/shared/lib/eden"
import { User } from "@/shared/types/User.type"
import { isReadMessage } from "@/shared/utils/isReadMessage"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useRef } from "react"
import { useChatScroll } from "../../hooks/useChatScroll"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"
import { useGetMessages } from "../../message/api/query/useGetMessages"
import { MessageListSkeleton } from "./Skeleton"

type MessageListProps = {
  chatId: string
  selectedMessageId?: string
  currentUser: User
  otherUserLastReadAt?: string
  handleUpdate: (editingMessage: EditingMessage) => void
  handleReplyToMessage: (message: ChatUIMessage) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const MessageList = ({
  chatId,
  selectedMessageId,
  currentUser,
  otherUserLastReadAt,
  handleUpdate,
  handleReplyToMessage,
  onDelete,
  onPreviewImage
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: messages = [], isLoading } = useGetMessages(chatId)

  const { mutate: updateLastReadAt } = useMutation({
    mutationFn: async () => {
      const lastIncommingMessage = [...messages]
        .slice()
        .reverse()
        .find(msg => msg.sender.id !== currentUser.id)

      if (
        !lastIncommingMessage ||
        lastIncommingMessage.sender.id === currentUser.id
      ) {
        return
      }
      await edenClient.chat({ chatId }).read.put({
        lastReadAt: lastIncommingMessage.createdAt
      })
    }
  })

  const throttledHandleScroll = useThrottle(() => updateLastReadAt(), 1000)

  useChatScroll(containerRef, messages, () => throttledHandleScroll())

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
            isRead={
              otherUserLastReadAt
                ? isReadMessage(msg.createdAt, otherUserLastReadAt)
                : false
            }
            {...msg}
          />
        ))
      )}
    </div>
  )
}
