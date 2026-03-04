import {
  ChatUIMessage,
  UIAttachment
} from "@/features/chat/message/model/message.types"
import { Message } from "@/features/chat/ui/Message/Message"
import { User } from "@/shared/types/User.type"
import { useDropzone } from "react-dropzone"
import { useCallback, useEffect, useRef } from "react"
import { MessageListSkeleton } from "./Skeleton"
import { UploadIcon } from "@/shared/components/ui/icons"

type MessageListProps = {
  chatId: string
  messages: ChatUIMessage[]
  isEditMessage: boolean
  isLoading: boolean
  currentUser: User
  handleUpdate: (
    id: string,
    initialValue: string,
    initialAttachments?: UIAttachment[]
  ) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const MessageList = ({
  messages,
  isEditMessage,
  isLoading,
  currentUser,
  handleUpdate,
  onDelete,
  onPreviewImage
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView()
    }
  }, [messages.length, isEditMessage])
  return (
    <>
      <div className="flex-1 p-4 space-y-5 overflow-y-auto scrollbar-thin">
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
              {...msg}
            />
          ))
        )}
        <div ref={messagesEndRef}></div>
      </div>
    </>
  )
}
