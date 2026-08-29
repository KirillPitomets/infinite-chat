import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { DirectInfo } from "./DirectInfo"
import { GroupInfo } from "./GroupInfo"
import { HeaderSkeleton } from "./HeaderSkeleton"
import {
  ArrowIcon,
  CameraIcon,
  InformationIcon,
  TrashIcon
} from "@/shared/components/ui/icons"
import Link from "next/link"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { ChatRoom } from "@/shared/types/api.type"
import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { currentUser } from "@clerk/nextjs/server"

/*
  group room've 
    - room name 
    - memberships count > 2 
    - type group 
*/

type ChatHeaderProps = {
  chatId: string
  type: "DIRECT" | "GROUP"
  memberships: ChatRoom["memberships"]
  chatName: string
  avatarUrl: string
  onDelete: () => void
}

export function ChatHeader({
  chatId,
  avatarUrl,
  chatName,
  memberships,
  type,
  onDelete
}: ChatHeaderProps) {
  const currentUser = useCurrentUser()

  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <div className="flex items-center gap-2">
        <Link
          href={ACCOUNT_PAGES.CHAT}
          className="hidden rotate-180 max-sm:block"
        >
          <ArrowIcon className="w-8 h-8 text-green-600" />
        </Link>
        {type === "DIRECT" && (
          <DirectInfo
            chatId={chatId}
            member={
              memberships.filter(member => member.id !== currentUser.id)[0].user
            }
          />
        )}
        {type === "GROUP" && (
          <GroupInfo
            avatarUrl={avatarUrl}
            membersCount={memberships.length}
            name={chatName}
          />
        )}
      </div>
      <div className="flex space-x-1">
        <IconButtonBase size={4}>
          <CameraIcon />
        </IconButtonBase>

        <IconButtonBase tone="muted" size={4}>
          <InformationIcon />
        </IconButtonBase>

        <button onClick={() => onDelete()}>
          <IconButtonBase size={4}>
            <TrashIcon />
          </IconButtonBase>
        </button>
      </div>
    </header>
  )
}
