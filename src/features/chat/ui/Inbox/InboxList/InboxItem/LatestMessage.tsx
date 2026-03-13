import { useCurrentUser } from "@/shared/context/CurrentUserContext"
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
            <span>
              {latestMessage.sender.id === user.id
                ? "you: "
                : `${latestMessage.sender.name}: `}
            </span>
            {latestMessage.content}
          </>
        ) : (
          <>No message yet</>
        )}
      </p>
    </div>
  )
}

export default LatestMessage
