import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"
import { ChatRoom, ChatRoomMember } from "@/shared/types/api.type"
import { MemberDetailedInfo } from "./MemberDetailedInfo"
import { UserX } from "lucide-react"
import { getButtonStyleClass } from "@/shared/components/ui/IconButtonBase"
import { useConfirm } from "../../providers/ConfirmDialogProvider"
import { Loader } from "@/shared/components/ui/Loader"
import { unwrap } from "@/shared/lib/api/unwrap"
import { useApiClient } from "@/shared/lib/api/useApiClient"
import { parseErrorMessage } from "@/shared/utils/parseErrorStatus"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

type MemberListItemProps = {
  chatId: string
  chatType: ChatRoom["type"]
  member: ChatRoomMember
}

export const MemberListItem = ({
  chatId,
  chatType,
  member
}: MemberListItemProps) => {
  const confirm = useConfirm()

  const api = useApiClient()
  const { mutate: handleKickMember, isPending } = useMutation({
    mutationFn: async (member: ChatRoomMember) => {
      if (chatType === "DIRECT") {
        throw new Error("Member can't be removed from a direct chat")
      }

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
      const { text } = parseErrorMessage(err.message)

      toast.error(text)
    }
  })

  const handleKick = async () => {
    const ok = await confirm({
      title: `Remove ${member.user.username} from chat?`,
      des: "They'll lose access to this chat and won't be send messages until re-added",
      confirmLabel: "Remove"
    })

    if (ok) handleKickMember(member)
  }

  return (
    <li className="group relative flex justify-between items-center p-2 hover:bg-zinc-700 transition-all">
      <MemberDetailedInfo member={member} />
      <div className="flex gap-2">
        <UserAvatar
          size={7}
          url={member.user.imageUrl}
          alt={member.user.username}
        />
        <div>
          <p>
            {member.user.username}
            {" | "}
            <span className="opacity-50">{member.role.toLowerCase()}</span>
          </p>
        </div>
      </div>

      <button onClick={handleKick} className={getButtonStyleClass("danger")}>
        {isPending ? <Loader size={14} /> : <UserX size={16} />}
      </button>
    </li>
  )
}
