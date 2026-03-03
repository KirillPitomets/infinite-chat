import { ChatUIMessage } from "@/features/chat/model/chat.types"
import MessageContextMenu from "@/features/chat/ui/Message/ContextMenu"
import DeletedMessage from "@/features/chat/ui/Message/DeletedMessage"
import {
  CopyIcon,
  EditIcon,
  TrashIcon
} from "@/shared/components/ui/icons"
import { formatDate } from "date-fns"
import { useState } from "react"
import toast from "react-hot-toast"
import { MessageContent } from "./Content"
import { MessageSender } from "./Sender"
import { MessageStatus } from "./Status"

interface IMessageProps extends ChatUIMessage {
  isMine: boolean
  onUpdate: (id: string, initialValue: string) => void
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
  onUpdate,
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

  if (isDeleted || status === "deleted") {
    return (
      <DeletedMessage
        isMine={isMine}
        senderImageUrl={sender.imageUrl}
        senderName={sender.name}
      />
    )
  }

  const contextMenu = [
    {
      icon: EditIcon,
      handle: () => {
        setIsVisibleContextMenu(false)
        onUpdate(id, content)
      }
    },
    {
      icon: CopyIcon,
      handle: () => {
        navigator.clipboard.writeText(content)
        toast.success("Message has been copied :)")
        setIsVisibleContextMenu(false)
      }
    },
    {
      icon: TrashIcon,
      handle: () => {
        setIsVisibleContextMenu(false)
        onDelete(id)
      }
    }
  ]

  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div
        className={`max-w-[80%] flex flex-col space-y-2 ${status === "loading" && "opacity-70"} `}
      >
        {!isMine && (
          <MessageSender avatarUrl={sender.imageUrl} name={sender.name} />
        )}

        <div
          className="relative p-4 bg-zinc-100"
          onContextMenu={handleContextMenu}
        >
          <MessageContextMenu
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
