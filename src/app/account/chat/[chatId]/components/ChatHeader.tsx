import {IconButtonBase} from "@/components/ui/IconButtonBase"
import {CameraIcon, InformationIcon, TrashIcon} from "@/components/ui/icons"
import {useMutation} from "@tanstack/react-query"
import {edenClient} from "@/lib/eden"
import {useParams, useRouter} from "next/navigation"
import {ACOOUNT_PAGES} from "@/config/accountPages.config"
import Image from "next/image"

type ChatHeaderProps = {
  name: string
  tag?: string
  imageUrl: string
  status?: "online" | "offline"
}

export function ChatHeader({name, tag, imageUrl, status}: ChatHeaderProps) {
  const {chatId} = useParams<{chatId: string}>()
  const route = useRouter()

  const {mutate: deleteChat} = useMutation({
    mutationKey: ["chatHeader_deleteChat"],
    mutationFn: async () => {
      const res = await edenClient.chat.delete({chatId})
      if (res.status === 200) {
        route.replace(ACOOUNT_PAGES.CHAT)
      }
    }
  })

  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <div className="flex items-center gap-2">
        <div className="max-w-10.5 max-h-10.5 rounded-4xl bg-gray-600 overflow-hidden flex justify-center align-center">
          <Image
            width={42}
            height={42}
            src={imageUrl}
            alt={tag ? `${name} - ${tag}` : `${name}`}
          />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <span
            className={`${status === "online" ? "text-green-700" : "text-zinc-400"}`}
          >
            {status}
          </span>
        </div>
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
