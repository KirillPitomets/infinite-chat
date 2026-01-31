import {IconButtonBase} from "@/components/ui/IconButtonBase"
import {ChatInfo} from "./ChatInfo"
import {CameraIcon, InformationIcon, TrashIcon} from "@/components/ui/icons"
import {useMutation} from "@tanstack/react-query"
import { edenClient } from "@/lib/eden"
import { useParams, useRouter } from "next/navigation"
import { ACOOUNT_PAGES } from "@/config/accountPages.config"

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

  const {chatId} = useParams<{chatId: string}>()
  const route = useRouter()

  const {mutate: deleteChat} = useMutation({
    mutationKey: ["chatHeader_deleteChat"],
    mutationFn: async () => {
      const res = await edenClient.chat.delete({chatId})
      if ( res.status === 200 ) {
        route.replace(ACOOUNT_PAGES.CHAT)
      }

    }
  })

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

        <button onClick={() => deleteChat()}>
          <IconButtonBase>
            <TrashIcon />
          </IconButtonBase>
        </button>
      </div>
    </header>
  )
}
