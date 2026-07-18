import { edenClient } from "@/shared/lib/eden"
import { useMutation } from "@tanstack/react-query"
import Image from "next/image"
import toast from "react-hot-toast"
import {
  ChatUIMessage,
  mapAPIMessageToUI
} from "../../message/model/message.types"
import { ReloadIcon } from "@/shared/components/ui/icons"
import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { useChangeMessageStatus } from "../../message/api/useChangeMessageStatus"

type DeletedMessageProps = {
  id: string
  chatId: string
  isMine: boolean
  senderName: string
  senderImageUrl: string
}

const DeletedMessage = ({
  id,
  chatId,
  isMine,
  senderImageUrl,
  senderName
}: DeletedMessageProps) => {
  const changeMessageStatus = useChangeMessageStatus()
  const { mutate: restoreMessage } = useMutation({
    mutationFn: async () => {
      const res = await edenClient.messages.restore({ messageId: id }).post()

      if (res.status !== 200 || !res.data) {
        throw new Error("Failed to restore message")
      }

      return mapAPIMessageToUI(res.data, "sent", false)
    },
    onSuccess(message) {
      if (message) {
        changeMessageStatus({
          chatId: chatId,
          messageId: message.id,
          status: "sent"
        })
      }
    },
    onError(error) {
      toast.error(error.message)
    }
  })

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
              onClick={() => restoreMessage()}
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
