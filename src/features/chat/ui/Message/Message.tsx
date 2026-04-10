import {
  ChatUIMessage,
  UIAttachment
} from "@/features/chat/message/model/message.types"
import MessageContextMenu from "@/features/chat/ui/Message/ContextMenu"
import DeletedMessage from "@/features/chat/ui/Message/DeletedMessage"
import { formatDate } from "date-fns"
import { useState } from "react"
import toast from "react-hot-toast"
import { useMessageContextMenu } from "../../message/model/useMessageContextMenu"
import { MessageContent } from "./Content"
import { MessageSender } from "./Sender"
import { MessageStatus } from "./Status"
import { EditingMessage } from "../../message/api/mutate/useUpdateMessage"

interface IMessageProps extends ChatUIMessage {
  isMine: boolean
  selectedMessageId?: string
  handleUpdate: (editingMessage: EditingMessage) => void
  handleReplyToMessage: (message: ChatUIMessage) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const Message = ({
  id,
  selectedMessageId,
  isMine,
  content,
  sender,
  attachments,
  status,
  isDeleted,
  updatedAt,
  createdAt,
  replyToMessage,
  handleReplyToMessage,
  handleUpdate,
  onDelete,
  onPreviewImage
}: IMessageProps) => {
  const [isVisibleContextMenu, setIsVisibleContextMenu] = useState(false)
  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()
    setIsVisibleContextMenu(prev => !prev)
  }
  const contextMenu = useMessageContextMenu({
    closeContext: () => setIsVisibleContextMenu(false),
    copyMessage: () => {
      if (content) {
        navigator.clipboard.writeText(content)
        toast.success("Message copied :)")
      } else {
        toast.error("No text contetn for copy")
      }
    },
    deleteMessage() {
      onDelete(id)
    },
    updateMessage() {
      // handleUpdate(id, content, attachments)
      handleUpdate({
        id,
        initialValue: content,
        initialAttachments: attachments
      })
    },
    replyMessage() {
      handleReplyToMessage({
        id,
        attachments,
        content,
        createdAt,
        status,
        isDeleted,
        updatedAt,
        sender
      })
    }
  })

  if (isDeleted || status === "deleted") {
    return (
      <DeletedMessage
        isMine={isMine}
        senderImageUrl={sender.imageUrl}
        senderName={sender.name}
      />
    )
  }

  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div
        className={`max-w-[80%] flex flex-col space-y-2 ${status === "loading" && "opacity-70"} `}
      >
        {!isMine && (
          <MessageSender avatarUrl={sender.imageUrl} name={sender.name} />
        )}

        <div
          className={`relative px-3 py-1 rounded-sm 
            ${id === selectedMessageId 
              ? "bg-green-700 dark:bg-green-200" 
              : "bg-zinc-700 dark:bg-gray-200 "} 
            `}
        >
          {replyToMessage && (
            <div className="p-1 pl-2 text-sm border-l-2 border-black bg-zinc-800 dark:bg-gray-300 rounedd-xl">
              <p>{replyToMessage.sender.name}</p>
              <p className="opacity-80">{replyToMessage.content}</p>
            </div>
          )}

          <div
            className="flex flex-wrap items-end justify-between gap-3"
            onContextMenu={handleContextMenu}
          >
            <MessageContextMenu
              isMineMessage={isMine}
              isVisible={isVisibleContextMenu}
              buttons={contextMenu}
            />

            <MessageContent
              attachments={attachments}
              onPreviewImage={onPreviewImage}
              content={content}
              messageStatus={status}
            />

            <div className="flex justify-end space-x-2">
              <p className={`text-sm opacity-50 ${isMine && "text-end"}`}>
                {formatDate(createdAt, "HH:mm")}
              </p>

              <MessageStatus status={status} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
