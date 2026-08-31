import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { ReloadIcon } from "@/shared/components/ui/icons"
import Image from "next/image"
import { useChangeMessageStatus } from "../../message/api/useChangeMessageStatus"

type DeletedMessageProps = {
  id: string
  chatId: string
  isMine: boolean
  senderName: string
  senderImageUrl: string
  onRestore: (messageId: string) => void
}

const DeletedMessage = ({
  id,
  chatId,
  isMine,
  senderImageUrl,
  senderName,
  onRestore
}: DeletedMessageProps) => {
  const changeMessageStatus = useChangeMessageStatus()

  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      <div className="flex flex-col space-y-2">
        {!isMine && (
          <div className="flex space-x-2.5">
            <div className="w-6.25 h-6.25">
              <Image
                width={25}
                height={25}
                src={senderImageUrl}
                alt={senderName}
                className="rounded-2xl"
              />
            </div>
            <p>{senderName}</p>
          </div>
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
