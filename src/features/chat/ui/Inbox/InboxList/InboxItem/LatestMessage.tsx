// import { useLatestsMessageRealtime } from "@/features/chat/message/api/realtime/useLatestMessageRealtime"
import { useLatestsMessageRealtime } from "@/features/chat/message/api/realtime/useLatestMessageRealtime"
import { useCurrentUser } from "@/shared/context/CurrentUserContext"
import { edenClient } from "@/shared/lib/eden"
import { ChatMessage } from "@/shared/schemes/message.schema"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

const LatestMessage = ({
  chatId,
  initialLatestMessage
}: {
  chatId: string
  initialLatestMessage?: ChatMessage | null | undefined
}) => {
  const currentUser = useCurrentUser()

  const { data: latestMessage, isLoading } = useQuery({
    enabled: !!chatId,
    queryKey: ["latestMessage", chatId],
    queryFn: async () => {
      const res = await edenClient.chat({ chatId }).message.latest.get()

      if (res.status !== 200) {
        throw new Error("Failed to get latest message")
      }

      return res.data
    },
    initialData: initialLatestMessage
  })

  useLatestsMessageRealtime(chatId)

  if (isLoading) {
    return <span className="w-[70%] opacity-60 animate-pulse">...</span>
  }

  return (
    <div className="flex justify-between">
      <p className="truncate max-w-40 opacity-60">
        {latestMessage ? (
          <>
            <span>
              {latestMessage.sender.id === currentUser.id
                ? "you: "
                : `${latestMessage.sender.name}: `}
            </span>
            {latestMessage.content}
          </>
        ) : (
          <>No message yet</>
        )}
      </p>
      {latestMessage?.createdAt && (
        <p className="opacity-60">{format(latestMessage.createdAt, "HH:mm")}</p>
      )}
    </div>
  )
}

export default LatestMessage
