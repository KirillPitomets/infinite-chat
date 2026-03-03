import {
  ChatUIMessage,
  UIAttachment
} from "@/features/chat/message/model/message.types"
import MessageContextMenu from "@/features/chat/ui/Message/ContextMenu"
import DeletedMessage from "@/features/chat/ui/Message/DeletedMessage"
import { CopyIcon, EditIcon, TrashIcon } from "@/shared/components/ui/icons"
import { formatDate } from "date-fns"
import { useState } from "react"
import toast from "react-hot-toast"
import { MessageContent } from "./Content"
import { MessageSender } from "./Sender"
import { MessageStatus } from "./Status"
import { useMessageContextMenu } from "../../message/model/useMessageContextMenu"

interface IMessageProps extends ChatUIMessage {
  isMine: boolean
  handleUpdate: (
    id: string,
    initialValue: string,
    initialAttachments?: UIAttachment[]
  ) => void
  onDelete: (id: string) => void
  onPreviewImage: (image: { alt: string; url: string }) => void
}

export const Message = ({
  id,
  isMine,
  content,
  sender,
  attachments,
  status,
  isDeleted,
  createdAt,
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
      navigator.clipboard.writeText(content)
      toast.success("Message copied :)")
    },
    deleteMessage() {
      onDelete(id)
    },
    updateMessage() {
      handleUpdate(id, content, attachments)
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
          className="relative p-1.5 rounded-xl bg-zinc-100"
          onContextMenu={handleContextMenu}
        >
          {isMine && (
            <MessageContextMenu
              isVisible={isVisibleContextMenu}
              buttons={contextMenu}
            />
          )}

          <MessageContent
            attachments={attachments}
            onPreviewImage={onPreviewImage}
            content={content}
            messageStatus={status}
          />

          <div className="flex justify-end space-x-2">
            <p className={`text-sm text-zinc-500/70 ${isMine && "text-end"}`}>
              {formatDate(createdAt, "HH:mm")}
            </p>

            <MessageStatus status={status} />
          </div>
        </div>
      </div>
    </div>
  )
}
