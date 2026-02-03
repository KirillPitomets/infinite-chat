import Image from "next/image"
import {ChatUIMessage} from "@/types/ChatUiMessage"
import Loader from "@/components/ui/Loader"
import {TickIcon} from "@/components/ui/icons"

const formatDate = (unix: string) => {
  // todo: add yersterday, if date is later then DD/MM | HH/MM
  const date = new Date(unix)
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${hours >= 10 ? hours : "0" + hours}:${minutes >= 10 ? minutes : "0" + minutes}`
}

const ChatMessage = ({
  id,
  isMine,
  content,
  sender,
  status,
  createdAt
}: ChatUIMessage) => {
  return (
    <div className={`w-full flex ${isMine && "justify-end"} break-all`}>
      {status === "sending" && <div className="flex items-center mr-4"><Loader /></div> }
      <div
        className={`max-w-[80%] space-y-2 ${status === "sending" && "opacity-70"}`}
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

        <div className="flex gap-4 flex-wrap p-4 rounded-2xl bg-zinc-100">
          <p className="text-zinc-800">{content}</p>
          <div className="w-full flex justify-end space-x-2">
            <p className={`text-zinc-500 ${isMine && "text-end"}`}>
              {formatDate(createdAt)}
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

export default ChatMessage
