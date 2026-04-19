import { usePresenceUserStatus } from "@/shared/hooks/useUserPresence"
import Image from "next/image"
import { useRealtimeTyping } from "../../realtime/useRealtimeTyping"
import { TypingIndicator } from "@/shared/components/ui/TypingIndicator/TypingIndicator"

type DirectInfoProps = {
  chatId: string
  memberId: string
  avatarUrl: string
  tag: string
  name: string
}

export const DirectInfo = ({
  chatId,
  memberId,
  avatarUrl,
  tag,
  name
}: DirectInfoProps) => {
  const { isOnline } = usePresenceUserStatus(memberId)

  const { isMemberTyping } = useRealtimeTyping(chatId)

  return (
    <>
      <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
        <Image
          width={42}
          height={42}
          src={avatarUrl}
          alt={tag ? `${name} - ${tag}` : `${name}`}
        />
      </div>
      <div>
        <p className="font-semibold">{name}</p>

        {isMemberTyping ? (
          <TypingIndicator />
        ) : (
          <span className={`${isOnline ? "text-green-600" : "text-zinc-400"}`}>
            {isOnline ? "online" : "offline"}
          </span>
        )}
      </div>
    </>
  )
}
