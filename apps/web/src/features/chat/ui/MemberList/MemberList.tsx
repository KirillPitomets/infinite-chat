import { ChatRoom, ChatRoomMember } from "@/shared/types/api.type"
import { cn } from "@/shared/utils/cn"
import { Ref } from "react"
import { MemberListItem } from "./MemberListItem"

type MemberListProps = {
  chatId: string
  chatType: ChatRoom["type"]
  memberships: ChatRoomMember[]
  isActive: boolean
  onClose: () => void
  ref: Ref<HTMLUListElement | null>
}

export const MemberList = ({
  chatId,
  chatType,
  memberships,
  isActive,
  onClose,
  ref
}: MemberListProps) => {
  return (
    <ul
      ref={ref}
      style={{ background: "var(--background)" }}
      className={cn(
        "w-0  transition-all max-w-60 h-full max-mid:absolute right-0 top-0 z-1 rounded-sm border-l border-white",
        { "w-full": isActive }
      )}
    >
      {memberships.map(member => (
        <MemberListItem
          key={member.id}
          chatId={chatId}
          chatType={chatType}
          member={member}
        />
      ))}
    </ul>
  )
}
