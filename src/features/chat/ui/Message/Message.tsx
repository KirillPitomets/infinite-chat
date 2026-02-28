import { ChatUIMessage } from "@/features/chat/model/chat.types"
import MessageContextMenu from "@/features/chat/ui/Message/ContextMenu"
import DeletedMessage from "@/features/chat/ui/Message/DeletedMessage"
import { Dialog } from "@/shared/components/Dialog/Dialog"
import {
  CopyIcon,
  EditIcon,
  TickIcon,
  TrashIcon
} from "@/shared/components/ui/icons"
import Loader from "@/shared/components/ui/Loader"
import { formatDate } from "date-fns"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"
import { Attachments } from "./Attachments"

interface IMessageProps extends ChatUIMessage {
  isMine: boolean
  onUpdate: (id: string, initialValue: string) => void
  onDelete: (id: string) => void
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
  onDelete
}: IMessageProps) => {
  const [isVisibleContextMenu, setIsVisibleContextMenu] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    name: string
  } | null>(null)

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
        setIsVisibleContextMenu(false)
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
      {status === "sending" ||
        (status === "editing" && (
          <div className="flex items-center mr-4">
            <Loader />
          </div>
        ))}

      <div
        className={`max-w-[80%] flex flex-col space-y-2 ${status === "sending" && "opacity-70"}`}
      >
        {!isMine && (
          <div className="flex space-x-2.5">
            <Image
              width={25}
              height={25}
              src={sender.imageUrl}
              alt={sender.name}
              className="rounded-2xl"
            />
            <p>{sender.name}</p>
          </div>
        )}
        <div
          className="relative flex flex-wrap items-end gap-4 p-3 rounded-2xl bg-zinc-100"
          onContextMenu={handleContextMenu}
        >
          <MessageContextMenu
            isVisible={isVisibleContextMenu}
            buttons={contextMenu}
          />

          <div className="space-y-3">
            <Attachments
              attachments={attachments}
              openDialog={(url: string, name: string) =>
                setSelectedImage({ url, name })
              }
            />
            <p className="text-zinc-800">{content}</p>
          </div>

          <div className="flex justify-end space-x-2">
            <p className={`text-sm text-zinc-500/70 ${isMine && "text-end"}`}>
              {formatDate(createdAt, "HH:mm")}
            </p>
            {status === "sent" && (
              <div className="flex items-end text-green-500">
                <TickIcon />
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <img
            className="max-w-full"
            src={selectedImage.url}
            alt={selectedImage.name}
          />
        )}
      </Dialog>
    </div>
  )
}
