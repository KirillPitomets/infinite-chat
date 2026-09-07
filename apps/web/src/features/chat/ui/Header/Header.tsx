"use client"

import { useCurrentUser } from "@/features/user/hooks/useCurrentUser"
import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
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

/*
  group room've 
    - room name 
    - memberships count > 2 
    - type group 
*/

type ChatHeaderProps = {
  chatId: string
  type: ChatRoom["type"]
  memberships: ChatRoom["memberships"]
  chatName: string
  avatarUrl: string
}

export function ChatHeader({
  chatId,
  avatarUrl,
  chatName,
  memberships,
  type
}: ChatHeaderProps) {
  const currentUser = useCurrentUser()

  const directChatPartner = getDirectChatPartner(memberships, currentUser.id)

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
        <IconButtonBase size={4}>
          <CameraIcon />
        </IconButtonBase>

        <IconButtonBase tone="muted" size={4}>
          <InformationIcon />
        </IconButtonBase>

        <button onClick={() => console.log("TODO IT - DELETE CHAT")}>
          <IconButtonBase size={4}>
            <TrashIcon />
          </IconButtonBase>
        </button>
      </div>
    </header>
  )
}
