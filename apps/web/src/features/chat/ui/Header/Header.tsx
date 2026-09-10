"use client"

import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import {
  ArrowIcon,
  CameraIcon,
  InformationIcon,
  TrashIcon
} from "@/shared/components/ui/icons"
import { ACCOUNT_PAGES } from "@/shared/config/accountPages.config"
import { ChatRoom } from "@/shared/types/api.type"
import { getDirectChatPartner } from "@/shared/utils/getDirectChatPartner"
import Link from "next/link"
import { DirectInfo } from "./DirectInfo"
import { GroupInfo } from "./GroupInfo"
import { Camera, Info, Trash } from "lucide-react"
import { getButtonStyleClass } from "@/shared/components/ui/IconButtonBase"
import { ConfirmDialog } from "@/shared/components/ConfirmDialog/ConfirmDialog"
import { useConfirm } from "../../providers/ConfirmDialogProvider"

type ChatHeaderProps = {
  chatId: string
  type: ChatRoom["type"]
  memberships: ChatRoom["memberships"]
  chatName: string
  avatarUrl: string

  isActiveInfoButton?: boolean

  handleInfoButton: () => void
  handleDeleteRoom: () => void
}

export function ChatHeader({
  chatId,
  avatarUrl,
  chatName,
  memberships,
  type,

  isActiveInfoButton,

  handleInfoButton,
  handleDeleteRoom
}: ChatHeaderProps) {
  const currentUser = useCurrentUser()
  const directChatPartner = getDirectChatPartner(memberships, currentUser.id)
  const confirm = useConfirm()

  async function handleDelete() {
    const ok = await confirm({
      title: "⚠️ Delete chat permanently?",
      des: "Chat and all message will be deleted for all users"
    })
    if (ok) handleDeleteRoom()
  }

  return (
    <header className="flex items-center justify-between p-2.5 border-b border-zinc-300">
      <div className="flex items-center gap-2">
        <Link
          href={ACCOUNT_PAGES.CHAT}
          className="hidden rotate-180 max-sm:block"
        >
          <ArrowIcon className="w-8 h-8 text-green-600" />
        </Link>

        {type === "DIRECT" && directChatPartner && (
          <DirectInfo chatId={chatId} member={directChatPartner} />
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
        <button className={getButtonStyleClass("primary")}>
          <Camera size={20} />
        </button>

        <button
          onClick={handleInfoButton}
          className={getButtonStyleClass("muted", isActiveInfoButton)}
        >
          <Info size={20} />
        </button>

        <button
          onClick={handleDelete}
          className={getButtonStyleClass("danger")}
        >
          <Trash size={20} />
        </button>
      </div>
    </header>
  )
}
