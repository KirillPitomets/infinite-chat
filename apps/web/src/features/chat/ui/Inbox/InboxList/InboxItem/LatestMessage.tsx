import { ChatUIMessage } from "@/features/chat/message/model/message.types"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"

type LatestMessageProps = {
  latestMessage?: ChatUIMessage | null | undefined
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
                : `${latestMessage.sender.username}: `}
            </span>
            {latestMessage.text ? (
              latestMessage.text
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
