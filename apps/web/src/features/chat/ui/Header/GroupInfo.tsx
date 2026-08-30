import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"
import Image from "next/image"

export const GroupInfo = ({
  avatarUrl,
  name,
  membersCount
}: {
  avatarUrl: string
  name: string
  membersCount: number
}) => {
  return (
    <>
      <UserAvatar size={10} url={avatarUrl} alt={name} />
      <div>
        <p className="font-semibold">{name}</p>
        <span className="text-zinc-400">Members: {membersCount}</span>
      </div>
    </>
  )
}
