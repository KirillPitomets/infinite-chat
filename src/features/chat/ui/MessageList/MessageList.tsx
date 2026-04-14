import { ChatUIMessage } from "@/features/chat/message/model/message.types"
import { Message } from "@/features/chat/ui/Message/Message"
import { User } from "@/shared/types/User.type"
import { useEffect, useRef } from "react"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"
import { MessageListSkeleton } from "./Skeleton"
import { isAtElementBottom } from "@/shared/utils/isAtElementBottom"
import { useMutation } from "@tanstack/react-query"
import { edenClient } from "@/shared/lib/eden"
import { useDebounce } from "@/shared/hooks/useDebounce"

type MessageListProps = {
  chatId: string
  selectedMessageId?: string
  messages: ChatUIMessage[]
  isEditMessage: boolean
  isLoading: boolean
  currentUser: User
  isReplyToMessage: boolean
  otherUserReadAt?: string
  handleUpdate: (editingMessage: EditingMessage) => void
  handleReplyToMessage: (message: ChatUIMessage) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const MessageList = ({
  chatId,
  messages,
  isEditMessage,
  selectedMessageId,
  isReplyToMessage,
  isLoading,
  currentUser,
  otherUserReadAt,
  handleUpdate,
  handleReplyToMessage,
  onDelete,
  onPreviewImage
}: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { mutate: updateLastReadAt } = useMutation({
    mutationFn: async () => {
      await edenClient.chat({ chatId }).read.put({
        lastReadAt: messages[messages.length - 1].createdAt
      })
    }
  })

  const debounceHandleScroll = useDebounce(() => updateLastReadAt(), 1000)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    el.scrollTop = el.scrollHeight
  }, [isEditMessage, isReplyToMessage, messages])

  useEffect(() => {
    const el = containerRef.current

    if (!el) return

    const handleScroll = () => {
      if (isAtElementBottom(el)) {
        debounceHandleScroll()
      }
    }

    el.addEventListener("scroll", handleScroll)
    return () => el.removeEventListener("scroll", handleScroll)
  }, [debounceHandleScroll])

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
              otherUserReadAt
                ? new Date(msg.createdAt).getTime() <=
                  new Date(otherUserReadAt).getTime()
                : false
            }
            {...msg}
          />
        ))
      )}
    </div>
  )
}
