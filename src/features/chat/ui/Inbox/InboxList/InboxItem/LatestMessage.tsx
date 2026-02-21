import {useCurrentUser} from "@/shared/context/CurrentUserContext"
import {edenClient} from "@/shared/lib/eden"
import {useRealtime} from "@/shared/lib/realtime-client"
import {ChatMessageDTO} from "@/shared/schemes/message.schema"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {format} from "date-fns"

const LatestMessage = ({
  chatId,
  initialLatestMessage
}: {
  chatId: string
  initialLatestMessage?: ChatMessageDTO | null | undefined
}) => {
  const queryClient = useQueryClient()
  const currentUser = useCurrentUser()

  const {data: latestMessage, isLoading} = useQuery({
    enabled: !!chatId,
    queryKey: ["latestMessage", chatId],
    queryFn: async () => {
      const res = await edenClient.message.latest.get({query: {chatId}})

      if (res.status !== 200) {
        throw new Error("Failed to get latest message")
      }

      return res.data
    },
    initialData: initialLatestMessage
  })

  useRealtime({
    channels: [chatId],
    events: [
      "chat.message.created",
      "chat.message.updated",
      "chat.message.deleted"
    ],
    onData({data, event}) {
      switch (event) {
        case "chat.message.created":
          queryClient.setQueryData(["latestMessage", chatId], data)
          break
        case "chat.message.updated":
          queryClient.setQueryData(["latestMessage", chatId], data)
          break
        default:
          break
      }
    }
  })

  if (isLoading) {
    return <span className="w-[70%] opacity-60 animate-pulse">...</span>
  }

  return (
    <div className="flex justify-between">
      <p className="truncate max-w-35 opacity-60">
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
        <p className="opacity-60">{format(latestMessage.createdAt, "HH:MM")}</p>
      )}
    </div>
  )
}

export default LatestMessage
