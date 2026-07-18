import { TypingIndicator } from "@/shared/components/ui/TypingIndicator/TypingIndicator"
import { useRealtimeTyping } from "@/features/chat/realtime/useRealtimeTyping"

export const ChatTypingBanner = ({ chatId }: { chatId: string }) => {
  const { isMemberTyping, member } = useRealtimeTyping(chatId)

  if (!isMemberTyping) {
    return
  }

  return (
    <div className="flex items-end gap-1 p-2  bg-zinc-100 rounded-tr-2xl">
      <p className="font-semibol text-zinc-800">{member.name} is</p>
      <TypingIndicator />
    </div>
  )
}
