import { usePresenceUserStatus } from "@/shared/hooks/useUserPresence"
import Image from "next/image"

export const DirectInfo = ({
  memberId,
  avatarUrl,
  tag,
  name
}: {
  memberId: string
  avatarUrl: string
  tag: string
  name: string
}) => {
  const { isOnline } = usePresenceUserStatus(memberId)

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
        <span className={`${isOnline ? "text-green-700" : "text-zinc-400"}`}>
          {isOnline ? "online" : "offline"}
        </span>
      </div>
    </>
  )
}
