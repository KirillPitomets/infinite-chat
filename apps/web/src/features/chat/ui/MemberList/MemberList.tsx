import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"
import { ChatRoomMember } from "@/shared/types/api.type"
import { MemberListItem } from "./MemberListItem"
import { useMutation } from "@tanstack/react-query"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { unwrap } from "@/shared/lib/api/unwrap"
import toast from "react-hot-toast"

type MemberListProps = {
  chatId: string
  memberships: ChatRoomMember[]
}

export const MemberList = ({ chatId, memberships }: MemberListProps) => {
  const api = useApiClient()
  const { mutate: handleKickMember, isPending } = useMutation({
    mutationFn: async (member: ChatRoomMember) => {
      await unwrap(
        api.DELETE("/api/v1/room/group/{roomId}/kick/{memberId}", {
          params: { path: { memberId: member.id, roomId: chatId } }
        })
      )
    },
    onSuccess(_, variables) {
      toast.success(`User ${variables.user.username} removed from chat`)
    },
    onError(err) {
      toast.error(err.message)
    }
  })

  return (
    <ul
      style={{ background: "var(--background)" }}
      className="w-full max-w-60 h-full max-mid:absolute right-0 top-0 z-1000 rounded-sm border-l border-white"
    >
      {memberships.map(member => (
        <MemberListItem member={member} handleKickMember={handleKickMember} />
      ))}
    </ul>
  )
}
