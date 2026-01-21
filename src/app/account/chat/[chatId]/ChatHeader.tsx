import {IconButtonBase} from "@/components/ui/IconButtonBase"
import {ChatInfo} from "./ChatInfo"
import {CameraIcon, InformationIcon} from "@/components/ui/icons"

type ChatHeaderProps = {
  name: string
  tag?: string
  imageUrl: string
  membersCount: number
  status?: "online" | "offline"
  type: "DIRECT" | "GROUP"
}

export function ChatHeader({
  name,
  tag,
  imageUrl,
  type,
  membersCount,
  status
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <ChatInfo
        name={name}
        status={type === "DIRECT" ? status : undefined}
        membersCount={type === "GROUP" ? membersCount : undefined}
        imgUrl={imageUrl}
        tag={tag}
      />

      <div className="flex space-x-1">
        <IconButtonBase>
          <CameraIcon />
        </IconButtonBase>

        <IconButtonBase tone="muted">
          <InformationIcon />
        </IconButtonBase>
      </div>
    </header>
  )
}
