import {IconButtonBase} from "@/components/ui/IconButtonBase"
import {CameraIcon, InformationIcon, TrashIcon} from "@/components/ui/icons"
import {ACOOUNT_PAGES} from "@/config/accountPages.config"
import {edenClient} from "@/lib/eden"
import {useMutation, useQuery} from "@tanstack/react-query"
import {useParams, useRouter} from "next/navigation"
import {DirectInfo} from "./DirectInfo"
import {GroupInfo} from "./GroupInfo"
import {HeaderSkeleton} from "./HeaderSkeleton"

export function Header() {
  const {chatId} = useParams<{chatId: string}>()
  const route = useRouter()

  const {data: chatData, isLoading} = useQuery({
    queryKey: ["chatHeader", chatId],
    queryFn: async () => {
      if (!chatId) return

      const res = await edenClient.chat({chatId}).get()
      return res.data
    }
  })

  const {mutate: deleteChat} = useMutation({
    mutationKey: ["chatHeader_deleteChat", chatId],
    mutationFn: async () => {
      const res = await edenClient.chat.delete({chatId})
      if (res.status === 200) {
        route.replace(ACOOUNT_PAGES.CHAT)
      }
    }
  })

  if (isLoading || !chatData) return <HeaderSkeleton />

  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <div className="flex items-center gap-2">
        {chatData.type === "DIRECT" && (
          <DirectInfo
            avatarUrl={chatData.otherUser.imageUrl}
            name={chatData.otherUser.name}
            tag={chatData.otherUser.tag}
            status="offline"
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

        <button onClick={() => deleteChat()}>
          <IconButtonBase>
            <TrashIcon />
          </IconButtonBase>
        </button>
      </div>
    </header>
  )
}
