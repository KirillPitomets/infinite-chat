import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { ReloadIcon } from "@/shared/components/ui/icons"
import Image from "next/image"
import { useChangeMessageStatus } from "../../message/api/useChangeMessageStatus"
import { Message, User } from "@/shared/types/api.type"
import { MessageSender } from "./Sender"
import { CircleX, DeleteIcon } from "lucide-react"

type DeletedMessageProps = {
  id: string
  isMine: boolean
  sender: User
  onRestore: (messageId: string) => void
  onContextMenu: (e: MouseEvent) => void
  prevSenderMessageId?: string
}

const DeletedMessage = ({
  id,
  sender,
  prevSenderMessageId,
  isMine,
  onContextMenu
}: DeletedMessageProps) => {
  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div className="flex flex-col">
        {!isMine && sender.id !== prevSenderMessageId && (
          <MessageSender avatarUrl={sender.imageUrl} name={sender.username} />
        )}

        <div
          onContextMenu={e => onContextMenu(e)}
          className=" flex items-center  gap-1 py-1 px-2 rounded-sm bg-gray-200 dark:bg-zinc-700 relative group"
        >
          <CircleX size={16} />
          <p className="text-zinc-800 dark:text-white">Message had deleted</p>
        </div>
      </div>
    </div>
  )
}

export default DeletedMessage

/*


*/
