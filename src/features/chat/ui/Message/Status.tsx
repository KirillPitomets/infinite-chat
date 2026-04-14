import { ChatUIMessage } from "../../message/model/message.types"
import { CrossIcon, TickIcon } from "@/shared/components/ui/icons"
import { Loader } from "@/shared/components/ui/Loader"

export const MessageStatus = ({
  status
}: {
  status: ChatUIMessage["status"]
}) => {
  return (
    <div className="flex justify-center items-center text-green-500">
      {status === "sent" ? (
        <TickIcon className="size-3.5" />
      ) : status === "loading" ? (
        <Loader size={12} thickness={2} />
      ) : status === "readed" ? (
        <div className="flex items-center relative">
          <TickIcon className="size-3.5" />
          <TickIcon className=" absolute left-1 top-0 size-3.5" />
        </div>
      ) : (
        <CrossIcon className="text-red-500" />
      )}
    </div>
  )
}
