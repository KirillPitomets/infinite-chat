import { UserAvatar } from "@/shared/components/ui/UserAvatar/UserAvatar"

type MessageSenderProps = {
  avatarUrl: string
  name: string
}

export const MessageSender = ({ avatarUrl, name }: MessageSenderProps) => {
  return (
    <div className="flex space-x-2.5">
      <UserAvatar url={avatarUrl} alt={name} size={7} />
      <p>{name}</p>
    </div>
  )
}
