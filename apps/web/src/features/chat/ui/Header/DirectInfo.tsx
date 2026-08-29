import { usePresenceUserStatus } from "@/shared/hooks/useUserPresence"
import Image from "next/image"
import { useRealtimeTyping } from "../../realtime/useRealtimeTyping"
import { TypingIndicator } from "@/shared/components/ui/TypingIndicator/TypingIndicator"
import { User } from "@/shared/types/api.type"

type DirectInfoProps = {
  chatId: string
  member: User
}

export const DirectInfo = ({ chatId, member }: DirectInfoProps) => {
  // const { isOnline } = usePresenceUserStatus(member.id)
  // const { isMemberTyping } = useRealtimeTyping(chatId)

  return (
    <>
      <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
        <Image
          width={42}
          height={42}
          src={member.imageUrl}
          alt={member.username}
        />
      </div>
      <div>
        <p className="font-semibold">{member.username}</p>

        {
          /*isMemberTyping */
          true ? (
            <TypingIndicator />
          ) : (
            <span
              className={`${/*isOnline*/ true ? "text-green-600" : "text-zinc-400"}`}
            >
              {/*isOnline*/ true ? "online" : "offline"}
            </span>
          )
        }
      </div>
    </>
  )
}
