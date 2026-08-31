import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { ReloadIcon } from "@/shared/components/ui/icons"
import Image from "next/image"
import { useChangeMessageStatus } from "../../message/api/useChangeMessageStatus"
import { Message, User } from "@/shared/types/api.type"
import { MessageSender } from "./Sender"

type DeletedMessageProps = {
  id: string
  isMine: boolean
  sender: User
  onRestore: (messageId: string) => void
  prevSenderMessageId?: string
}

const DeletedMessage = ({
  id,
  sender,
  prevSenderMessageId,
  isMine,
  onRestore
}: DeletedMessageProps) => {
  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div className="flex flex-col space-y-2">
        {!isMine && sender.id !== prevSenderMessageId && (
          <MessageSender avatarUrl={sender.imageUrl} name={sender.username} />
        )}
        <div className="p-3 rounded-2xl bg-gray-200 dark:bg-zinc-700 relative group">
          {isMine && (
            <button
              onClick={() => onRestore(id)}
              className="absolute top-0 left-0 -translate-x-full opacity-0 group-hover:opacity-100"
            >
              <IconButtonBase>
                <ReloadIcon />
              </IconButtonBase>
            </button>
          )}
          <p className="text-zinc-800 dark:text-white">Message had deleted</p>
        </div>
      </div>
    </div>
  )
}

export default DeletedMessage
