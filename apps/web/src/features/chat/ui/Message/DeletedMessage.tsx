import { User } from "@/shared/types/api.type"
import { CircleX } from "lucide-react"
import { MessageSender } from "./Sender"

type DeletedMessageProps = {
  id: string
  isMine: boolean
  sender: User
  onRestore: (messageId: string) => void
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
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
