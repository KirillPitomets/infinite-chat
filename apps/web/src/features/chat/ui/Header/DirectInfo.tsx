import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"
import { useIsOnline } from "@/shared/hooks/useIsOnline"
import { User } from "@/shared/types/api.type"

type DirectInfoProps = {
  member: User
}

export const DirectInfo = ({ member }: DirectInfoProps) => {
  const isOnline = useIsOnline(member.id)

  return (
    <>
      <UserAvatar size={10} url={member.imageUrl} alt={member.username} />
      <div>
        <p className="font-semibold">{member.username}</p>

        <span className={`${isOnline ? "text-green-600" : "text-zinc-400"}`}>
          {isOnline ? "online" : "offline"}
        </span>
      </div>
    </>
  )
}
