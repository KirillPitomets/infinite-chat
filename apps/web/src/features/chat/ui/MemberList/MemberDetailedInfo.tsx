import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"
import { ChatRoomMember } from "@/shared/types/api.type"
import { format } from "date-fns"
import { Calendar, Mail, Send } from "lucide-react"
import { useCreateOrFindDirectChat } from "../../chat/api/mutate/useCreateOrFindDirectChat"
import { Loader } from "@/shared/components/ui/Loader"
import { Button } from "../../../../shared/components/ui/Button"

type MemberDetailedInfoProps = {
  member: ChatRoomMember
}

export const MemberDetailedInfo = ({ member }: MemberDetailedInfoProps) => {
  const { createChat, isPending } = useCreateOrFindDirectChat()

  return (
    <div
      style={{ background: "var(--background)" }}
      className="w-full border absolute top-0 left-0 z-1002 p-2 border-sm -translate-x-full 
      flex gap-2 flex-col 
      opacity-0 transition-opacity pointer-events-none 
      group-hover:pointer-events-auto 
      group-hover:opacity-100
      max-mid:translate-x-0
      max-mid:top-full
      "
    >
      <div className="flex items-center gap-2">
        <UserAvatar
          size={7}
          url={member.user.imageUrl}
          alt={member.user.username}
        />
        <div>
          <p>
            {member.user.firstName} {member.user.lastName}
          </p>
          <p className="opacity-50">{member.role.toLowerCase()}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Mail size={13} />
        <a
          href={`mailto:${member.user.email}`}
          className="text-sm text-green-700 hover:underline"
        >
          {member.user.email}
        </a>
      </div>
      <div className="flex gap-2 items-center">
        <Calendar size={13} />
        <p className="text-sm">
          joined: {format(member.createdAt, "dd:MM:yyyy")}{" "}
        </p>
      </div>
      <Button onClick={() => createChat(member.user.id)} isPending={isPending}>
        <Send size={13} />
        <p>send message</p>
      </Button>
    </div>
  )
}
