"use client"

import { chatKeys } from "@/features/chat/chat/model/chat.keys"
import { IconButtonBase } from "@/shared/components/ui/IconButtonBase"
import { UserChatPreview } from "@/shared/schemes/chatPreview.schema"
import { matchRoute } from "@/shared/utils/matchRoute"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { navItems } from "./navItems.data"
import { useRealtimeNav } from "./useRealtimeNav"

export default function NavMenu() {
  const pathname = usePathname()

  const { data: inboxChats = [] } = useQuery<UserChatPreview[]>({
    queryKey: chatKeys.inbox(),
    // == TODO ==
    queryFn: async () => {
      return []
    }
  })

  const totalUnreadMessage = useMemo(
    () => inboxChats.reduce((value, chat) => value + chat.unreadCount, 0),
    [inboxChats]
  )

  useRealtimeNav(inboxChats)

  return (
    <div className="space-y-2">
      {navItems.map(item => (
        <Link className="relative block" key={item.href} href={item.href}>
          {item.id === "chats" && totalUnreadMessage > 0 && (
            <div className="absolute bottom-0 right-0 p-1 px-2 translate-[30%] text-xs text-white bg-red-500 font-semibold rounded-full">
              {totalUnreadMessage < 99 ? totalUnreadMessage : "..."}
            </div>
          )}

          <IconButtonBase isActive={matchRoute(pathname, item.href)}>
            <item.icon />
          </IconButtonBase>
        </Link>
      ))}
    </div>
  )
}
