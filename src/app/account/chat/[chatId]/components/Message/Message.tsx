import Loader from "@/components/ui/Loader"
import {CopyIcon, EditIcon, TickIcon, TrashIcon} from "@/components/ui/icons"
import {edenClient} from "@/lib/eden"
import {ChatUIMessage} from "@/types/ChatUiMessage"
import {useMutation} from "@tanstack/react-query"
import Image from "next/image"
import {useState} from "react"
import toast from "react-hot-toast"
import MessageContextMenu from "./ContextMenu"
import DeletedMessage from "./DeletedMessage"
import {formatDate} from "date-fns"

interface IMessageProps extends ChatUIMessage {
  isMine: boolean
  handleUpdateMessage: (id: string, initialValue: string) => void
}

export const Message = ({
  id,
  isMine,
  content,
  sender,
  status,
  isDeleted,
  createdAt,
  handleUpdateMessage
}: IMessageProps) => {
  const [isVisibleContextMenu, setIsVisibleContextMenu] = useState(false)

  const {mutate: deleteMessage, isPending: isDeletingMessage} = useMutation({
    mutationKey: ["deleteMessage", id],
    mutationFn: async () => {
      const res = await edenClient.message({messageId: id}).delete()
      if (res.status !== 200) {
        throw new Error(res.error?.value.message ?? "Failed to delete message")
      }
      return res.data
    },
    onSuccess(data) {
      // setIsDeletedMessage(true)
      toast.success("Message has been deleted")
    },
    onError(error) {
      toast.error(error.message)
    }
  })

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault()

    setIsVisibleContextMenu(prev => !prev)
  }

  if (isDeleted) {
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
        handleUpdateMessage(id, content)
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
        deleteMessage()
      }
    }
  ]

  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      {status === "sending" ||
        status === "editing" ||
        isDeletingMessage && (
          <div className="flex items-center mr-4">
            <Loader />
          </div>
        )}

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
          className="relative flex items-end flex-wrap gap-4 p-4 rounded-2xl bg-zinc-100"
          onContextMenu={handleContextMenu}
        >
          {isVisibleContextMenu && <MessageContextMenu buttons={contextMenu} />}

          <p className="text-zinc-800">{content}</p>

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
    </div>
  )
}
