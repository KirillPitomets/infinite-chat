import { ChatMessage } from "@/shared/schemes/message.schema"

type LatestMessageProps = {
  latestMessage?: ChatMessage | null | undefined
}

const LatestMessage = ({ latestMessage }: LatestMessageProps) => {
  const user = useCurrentUser()

  return (
    <div className="flex justify-between">
      <p className="truncate max-w-40 opacity-60">
        {latestMessage ? (
          <>
            <span>{latestMessage.sender.id === user.id ? "you: " : ""}</span>
            {latestMessage.content ? (
              latestMessage.content
            ) : latestMessage.attachments.length ? (
              <>
                {latestMessage.attachments.length}
                <span className="text-sm"> FILES</span>
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          <>No message yet</>
        )}
      </p>
    </div>
  )
}

export default LatestMessage
