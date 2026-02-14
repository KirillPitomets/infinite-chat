import {edenClient} from "@/lib/eden"
import {useRealtime} from "@/lib/realtime-client"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import {format} from "date-fns"

const LatestMessage = ({chatId}: {chatId: string}) => {
  const {data: latestMessage, isLoading} = useQuery({
    queryKey: ["latestMessage", chatId],
    queryFn: async () => {
      if (chatId) {
        const res = await edenClient.message.latest.get({query: {chatId}})
        return res.data ?? null
      }
    }
  })

  const queryClient = useQueryClient()

  useRealtime({
    channels: [chatId],
    events: ["chat.message"],
    onData({data, event}) {
      if (event === "chat.message") {
        queryClient.setQueryData(["latestMessage", chatId], data)
      }
    }
  })

  if (isLoading) {
    return (
      <div className="w-[70%] h-5.5 bg-zinc-300/40 rounded-2xl animate-pulse" />
    )
  }

  if (!latestMessage) {
  }

  return (
    <div className="flex justify-between">
      <p className="max-w-35 truncate text-zinc-500">
        {latestMessage ? (
          <>
            <span>
              {latestMessage.isMine ? "you: " : `${latestMessage.sender.name}`}
              {": "}
            </span>
            {latestMessage.content}
          </>
        ) : (
          <>No message yet</>
        )}
      </p>
      {latestMessage?.createdAt && (
        <p className="text-zinc-600">
          {format(latestMessage.createdAt, "HH:MM")}
        </p>
      )}
    </div>
  )
}

export default LatestMessage
/*
{
*/
