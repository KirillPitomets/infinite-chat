import { usePresenceUserStatus } from "@/shared/hooks/useUserPresence"
import Image from "next/image"
import { useRealtimeTyping } from "../../realtime/useRealtimeTyping"
import { TypingIndicator } from "@/shared/components/ui/TypingIndicator/TypingIndicator"
import { User } from "@/shared/types/api.type"
import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"

type DirectInfoProps = {
  chatId: string
  member: User
}

export const DirectInfo = ({ chatId, member }: DirectInfoProps) => {
  // const { isOnline } = usePresenceUserStatus(member.id)
  // const { isMemberTyping } = useRealtimeTyping(chatId)

  return (
    <>
      <UserAvatar size={10} url={member.imageUrl} alt={member.username} />
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
