import { ACСOOUNT_PAGES } from "@/shared/config/accountPages.config"
import Image from "next/image"
import Link from "next/link"
import LatestMessage from "./LatestMessage"
import { ChatMessage } from "@/shared/schemes/message.schema"
import { usePresenceUserStatus } from "@/shared/hooks/useUserPresence"
import { useMemberTyping } from "@/features/chat/hooks/useMemberTyping"
import { TypingIndicator } from "@/shared/components/ui/TypingIndicator/TypingIndicator"

type ChatInboxItemProps = {
  chatId: string
  name: string
  avatarUrl: string
  memberId: string
  initialLatestMessage?: ChatMessage | null | undefined
}

export const ChatInboxItem = ({
  chatId,
  name,
  avatarUrl,
  initialLatestMessage,
  memberId
}: ChatInboxItemProps) => {
  const { isOnline } = usePresenceUserStatus(memberId)

  const { isMemberTyping, member } = useMemberTyping(chatId)

  return (
    <Link
      href={ACСOOUNT_PAGES.CHAT_ID(chatId)}
      className="flex items-center gap-2 px-5 py-1 transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-300 "
    >
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-zinc-300">
        {avatarUrl && (
          <Image
            className="rounded-full"
            width={36}
            height={36}
            src={avatarUrl}
            alt={name}
          />
        )}

        {isOnline && (
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full" />
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold">{name}</p>

        {isMemberTyping && member.id === memberId ? (
          <TypingIndicator />
        ) : (
          <LatestMessage
            chatId={chatId}
            initialLatestMessage={initialLatestMessage}
          />
        )}
      </div>
    </Link>
  )
}
