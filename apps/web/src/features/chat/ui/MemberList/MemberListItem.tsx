import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"
import { ChatRoomMember } from "@/shared/types/api.type"
import { MemberDetailedInfo } from "./MemberDetailedInfo"
import { UserX } from "lucide-react"
import { getButtonStyleClass } from "@/shared/components/ui/IconButtonBase"

type MemberListItemProps = {
  member: ChatRoomMember
  handleKickMember: (member: ChatRoomMember) => {}
}

export const MemberListItem = ({
  member,
  handleKickMember
}: MemberListItemProps) => {
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

      <button
        onClick={() => handleKickMember(member)}
        className={getButtonStyleClass("danger")}
      >
        <UserX size={16} />
      </button>
    </li>
  )
}
