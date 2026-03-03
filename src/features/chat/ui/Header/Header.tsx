import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { DirectInfo } from "./DirectInfo"
import { GroupInfo } from "./GroupInfo"
import { HeaderSkeleton } from "./HeaderSkeleton"
import { CameraIcon, InformationIcon, TrashIcon } from "@/shared/components/ui/icons"

type DirectChat = {
  type: "DIRECT"
  otherUser: {
    id: string
    name: string
    tag: string
    imageUrl: string
  }
}
type GroupChat = {
  type: "GROUP"
  name: string
  membersCount: number
  imageUrl: string
}

type ChatHeaderProps = {
  chatId: string
  isLoading: boolean
  chatData?: DirectChat | GroupChat
  onDelete: () => void
}

export function ChatHeader({ isLoading, chatData, onDelete }: ChatHeaderProps) {
  if (isLoading || !chatData) return <HeaderSkeleton />

  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <div className="flex items-center gap-2">
        {chatData.type === "DIRECT" && (
          <DirectInfo
            memberId={chatData.otherUser.id}
            avatarUrl={chatData.otherUser.imageUrl}
            name={chatData.otherUser.name}
            tag={chatData.otherUser.tag}
          />
        )}
        {chatData.type === "GROUP" && (
          <GroupInfo
            avatarUrl={chatData.imageUrl}
            membersCount={chatData.membersCount}
            name={chatData.name}
          />
        )}
      </div>
      <div className="flex space-x-1">
        <IconButtonBase>
          <CameraIcon />
        </IconButtonBase>
        <IconButtonBase tone="muted">
          <InformationIcon />
        </IconButtonBase>

        <button onClick={() => onDelete()}>
          <IconButtonBase>
            <TrashIcon />
          </IconButtonBase>
        </button>
      </div>
    </header>
  )
}
