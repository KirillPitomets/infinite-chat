import { ChatUIMessage } from "../../model/chat.types"
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
        <TickIcon />
      ) : status === "loading" ? (
        <Loader size={12} thickness={2} />
      ) : (
        <CrossIcon className="text-red-500" />
      )}
    </div>
  )
}
